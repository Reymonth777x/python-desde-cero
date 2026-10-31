"""Motor de Orilla.

Una sola fuente de verdad: este archivo juzga el programa del alumno.
Se carga una vez por vida del worker (ver public/python-worker.js) y se llama
con run_json(codigo, tramo_json). Todo lo que devuelve es JSON.
No importa módulos del alumno y el alumno no puede importar nada.
"""
import ast
import json
import sys
import traceback

MAX_EVENTOS = 4000
MAX_DECIR = 200
MAX_LINEA = 500
MAX_CODIGO = 20000
PRESUPUESTO_EVENTOS = 200_000
TRAZA_ARCHIVO = '<orilla>'

RUMBOS = ['norte', 'este', 'sur', 'oeste']
DELTA = {'norte': (0, -1), 'este': (1, 0), 'sur': (0, 1), 'oeste': (-1, 0)}
NOMBRES = {'.': 'agua', '~': 'agua_baja', '#': 'orilla', 'J': 'junco', 'R': 'rama',
           'B': 'boya', 'M': 'muelle', 'S': 'seco', '*': 'muestra', 'F': 'pez',
           'L': 'luz', 'x': 'fuera'}
PISABLES = set('.~JBMS*FL')

BUILTINS_REALES = {
    'int': int, 'str': str, 'float': float, 'bool': bool, 'range': range, 'len': len,
    'list': list, 'min': min, 'max': max, 'sum': sum, 'abs': abs,
    'enumerate': enumerate, 'dict': dict, 'tuple': tuple,
}
VERBOS_CON_COSTE = {'avanzar', 'girar_izquierda', 'girar_derecha', 'decir', 'pedir',
                    'recoger', 'limpiar', 'sembrar', 'entregar', 'medir', 'registrar',
                    'anotar'}
# Métodos permitidos y el constructo que los abre. `sort` y `reverse` no están:
# ordenar se practica con un `for`.
METODOS = {'append': 'lista', 'insert': 'lista', 'pop': 'lista', 'index': 'lista',
           'count': 'lista', 'get': 'dict', 'keys': 'dict', 'values': 'dict',
           'items': 'dict'}

SIEMPRE_CERRADO = {
    'Import': 'import', 'ImportFrom': 'import', 'ClassDef': 'class',
    'AsyncFunctionDef': 'async', 'AsyncFor': 'async', 'AsyncWith': 'async',
    'Await': 'await', 'Yield': 'yield', 'YieldFrom': 'yield', 'Global': 'global',
    'Nonlocal': 'nonlocal', 'With': 'with', 'Match': 'match', 'Lambda': 'lambda',
    'Delete': 'del', 'Assert': 'assert', 'Raise': 'raise', 'NamedExpr': ':=',
    'Starred': '*', ''ListComp': 'comprensiones', 'SetComp': 'comprensiones',
    'DictComp': 'comprensiones', 'GeneratorExp': 'comprensiones', 'Set': 'conjuntos',
    'TryStar': 'try', 'BitAnd': 'bit a bit', 'BitOr': 'bit a bit',
    'BitXor': 'bit a bit', 'LShift': 'bit a bit', 'RShift': 'bit a bit',
    'Invert': 'bit a bit', 'MatMult': '@', 'Del': 'del',
}
# nodo -> constructo que lo abre (None = siempre disponible)
NODO_CLAVE = {
    'Module': None, 'Expr': None, 'Assign': None, 'AnnAssign': None, 'Name': None,
    'Load': None, 'Store': None, 'Constant': None, 'Call': None, 'keyword': 'def',
    'Attribute': None, 'BinOp': None, 'UnaryOp': None, 'BoolOp': None, 'Compare': None,
    'AugAssign': 'aritmetica', 'JoinedStr': 'fstring', 'FormattedValue': 'fstring',
    'Add': 'aritmetica', 'Sub': 'aritmetica', 'Mult': 'aritmetica', 'Div': 'aritmetica',
    'FloorDiv': 'aritmetica', 'Mod': 'aritmetica', 'Pow': 'aritmetica',
    'USub': 'aritmetica', 'UAdd': 'aritmetica',
    'Not': 'comparaciones', 'And': 'comparaciones', 'Or': 'comparaciones',
    'Eq': 'comparaciones', 'NotEq': 'comparaciones', 'Lt': 'comparaciones',
    'LtE': 'comparaciones', 'Gt': 'comparaciones', 'GtE': 'comparaciones',
    'In': 'comparaciones', 'NotIn': 'comparaciones', 'Is': 'comparaciones',
    'IsNot': 'comparaciones',
    'If': 'if', 'IfExp': 'if', 'Pass': 'if', 'While': 'while', 'Break': 'while',
    'Continue': 'while', 'For': 'for', 'List': 'lista', 'Subscript': 'lista',
    'Slice': 'lista', 'FunctionDef': 'def', 'Return': 'def', 'arguments': 'def',
    'arg': 'def', 'Dict': 'dict', 'Tuple': 'tuple', 'Try': 'try', 'ExceptHandler': 'try',
}
LLAMADAS_CERRADAS = {'open', 'eval', 'exec', 'compile', 'getattr', 'setattr',
                     'delattr', 'globals', 'locals', 'vars', 'dir', 'type', 'super',
                     'object', 'property', 'sorted', 'reversed', 'map', 'filter',
                     'zip', 'breakpoint', 'help', 'exit', 'quit', 'id', 'hash',
                     'iter', 'next', 'callable', 'isinstance', 'issubclass',
                     'repr', 'format', 'chr', 'ord', 'round', 'pow', 'divmod',
                     'set', 'frozenset', 'bytes', 'bytearray', 'memoryview',
                     'classmethod', 'staticmethod', 'slice', 'complex', 'any', 'all'}


class OrillaError(Exception):
    pass


class _Corte(BaseException):
    """Corta la ejecución. No hereda de Exception: `except` del alumno no la ve."""

    def __init__(self, tipo):
        super().__init__(tipo)
        self.tipo = tipo


# --------------------------------------------------------------------------
# Compuerta de lenguaje (AST, nunca regex)
# --------------------------------------------------------------------------

def _hallazgo(linea, mensaje, leccion=None):
    return {'linea': linea or 1, 'mensaje': mensaje, 'leccion': leccion}


def _cierre_constructo(cap, clave, linea):
    ap = cap['aperturas']['constructos'].get(clave)
    if ap is None:
        return _hallazgo(linea, 'Esa construcción no está disponible en Orilla.')
    tramo = cap['tramos'][ap]
    info = cap['constructos'][clave]
    return _hallazgo(
        linea,
        f"Este tramo todavía no usa {info['etiqueta']}. `{info['kw']}` se abre en "
        f"{tramo['nombre']}, con la lección de {tramo['tema']}. {info['sugerencia']}",
        tramo['leccion'])


def _cierre_llamada(cap, nombre, linea, abiertos):
    verbos = cap['aperturas']['verbos']
    builtins = cap['aperturas']['builtins']
    if nombre in verbos:
        tramo = cap['tramos'][verbos[nombre]]
        lista = ', '.join(sorted(abiertos['verbos']))
        return _hallazgo(
            linea,
            f"Ese verbo todavía no está en este tramo. `{nombre}` se abre en "
            f"{tramo['nombre']}. Los que sí están: {lista}.", tramo['leccion'])
    if nombre in builtins:
        tramo = cap['tramos'][builtins[nombre]]
        return _hallazgo(
            linea,
            f"`{nombre}` todavía no se abre. Aparece en {tramo['nombre']}, con la f"lección de {tramo['tema']}.", tramo['leccion'])
    if nombre == 'print':
        extra = ' Para mostrar algo usa `decir(...)`.' if 'decir' in abiertos['verbos'] else ''
        return _hallazgo(linea, '`print` no se usa en Orilla.' + extra)
    if nombre == 'input':
        extra = ' Para preguntar usa `pedir(...)`.' if 'pedir' in abiertos['verbos'] else ''
        return _hallazgo(linea, '`input` no se usa en Orilla.' + extra)
    if nombre == 'sorted':
        return _hallazgo(linea, '`sorted` no se abre en Orilla: ordena con un `for`.')
    if nombre in LLAMADAS_CERRADAS:
        return _hallazgo(linea, f'`{nombre}` no se abre en Orilla.')
    return _hallazgo(linea, f'`{nombre}` no existe en este tramo.')


def _recorrer(nodo, linea=1):
    linea = getattr(nodo, 'lineno', linea) or linea
    yield nodo, linea
    for hijo in ast.iter_child_nodes(nodo):
        yield from _recorrer(hijo, linea)


def _compuerta(codigo, cap):
    """Devuelve (arbol, None) si el programa pasa, o (None, hallazgo)."""
    try:
        arbol = ast.parse(codigo, filename=TRAZA_ARCHIVO)
    except IndentationError as e:
        return None, _hallazgo(e.lineno, 'Ese bloque no está alineado.')
    except SyntaxError as e:
        return None, _hallazgo(e.lineno, 'Python no pudo leer el programa.')
    except (ValueError, RecursionError, MemoryError):
        return None, _hallazgo(1, 'Python no pudo leer el programa.')

    abiertos = cap['abiertos']
    constructos = set(abiertos['constructos'])
    llamables = set(abiertos['verbos']) | set(abiertos['builtins'])
    definidas = {n.name for n in ast.walk(arbol) if isinstance(n, ast.FunctionDef)}
    hallazgos = []

    def sumar(h):
        hallazgos.append(h)

    for nodo, linea in _recorrer(arbol):
        nombre = type(nodo).__name__
        if nombre in SIEMPRE_CERRADO:
            sumar(_hallazgo(linea, f'`{SIEMPRE_CERRADO[nombre]}` no se usa en Orilla.'))
            continue
        if nombre not in NODO_CLAVE:
            sumar(_hallazgo(linea, f'Esa construcción ({nombre}) no está disponible en Orilla.'))
            continue
        clave = NODO_CLAVE[nombre]
        if clave is not None and clave not in constructos:
            sumar(_cierre_constructo(cap, clave, linea))
            continue
        # Nombres con guion bajo inicial: cerrados siempre.
        for campo in ('id', 'attr', 'name', 'arg'):
            valor = getattr(nodo, campo, None)
            if isinstance(valor, str) and valor.startswith('_'):
                sumar(_hallazgo(linea, 'Los nombres que empiezan con guion bajo no se usan en Orilla.'))
        if isinstance(nodo, ast.Constant):
            if nodo.value is not None and type(nodo.value) not in (int, float, str, bool):
                sumar(_hallazgo(linea, 'Ese tipo de valor no está disponible en Orilla.'))
        elif isinstance(nodo, ast.Call):
            f = nodo.func
            if isinstance(f, ast.Name):
                if f.id not in llamables and f.id not in definidas:
                    sumar(_cierre_llamada(cap, f.id, linea, abiertos))
            elif not isinstance(f, ast.Attribute):
                sumar(_hallazgo(linea, 'Esa llamada no está disponible en Orilla.'))
            if any(k.arg is None for k in nodo.keywords):
                sumar(_hallazgo(linea, 'Esa forma de llamar no está disponible en Orilla.'))
        elif isinstance(nodo, ast.Attribute):
            if not nodo.attr.startswith('_'):
                abre = METODOS.get(nodo.attr)
                if abre is None:
                    sumar(_hallazgo(linea, 'Ese método no está disponible en Orilla.'))
                elif abre not in constructos:
                    sumar(_cierre_constructo(cap, abre, linea))
        elif isinstance(nodo, ast.FunctionDef):
            if nodo.decorator_list or getattr(nodo, 'type_params', None):
                sumar(_hallazgo(linea, 'Las funciones de Orilla no llevan decoradores.'))
        elif isinstance(nodo, ast.Try):
            if nodo.finalbody:
                sumar(_hallazgo(linea, '`finally` no se usa en Orilla.'))
        elif isinstance(nodo, ast.ExceptHandler):
            t = nodo.type
            if t is None:
                sumar(_hallazgo(linea, 'Escribe qué error capturas, por ejemplo `except OrillaError:`.'))
            elif not (isinstance(t, ast.Name) and t.id == 'OrillaError'):
                sumar(_hallazgo(linea, 'Solo se captura `OrillaError`.'))

    if hallazgos:
        return None, min(hallazgos, key=lambda h: h['linea'])
    return arbol, None


def _hechos(arbol):
    nodos, llamadas, defs = set(), set(), set()
    sin_const = False
    floordiv = False
    for n in ast.walk(arbol):
        nodos.add(type(n).__name__)
        if isinstance(n, ast.FunctionDef):
            defs.add(n.name)
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name):
            llamadas.add(n.func.id)
        if isinstance(n, (ast.Assign, ast.AnnAssign)) and n.value is not None \
                and not isinstance(n.value, ast.Constant):
            sin_const = True
        if isinstance(n, (ast.BinOp, ast.AugAssign)) and isinstance(n.op, ast.FloorDiv):
            floordiv = True
    return {'nodos': nodos, 'llamadas': llamadas, 'defs': defs,
            'sin_const': sin_const, 'floordiv': floordiv,
            'def_llamada': bool(defs & llamadas)}


def _cumple_token(token, h):
    if token.startswith('Call:'):
        return token[5:] in h['llamadas']
    if token == 'FloorDiv':
        return h['floordiv']
    if token == 'CalledDef':
        return h['def_llamada']
    if token == 'AssignNoConst':
        return h['sin_const']
    return token in h['nodos']


def _maestria_ok(cap, h):
    return all(any(_cumple_token(t, h) for t in grupo) for grupo in cap.get('maestria') or [])


# --------------------------------------------------------------------------
# Mundo
# --------------------------------------------------------------------------

class Mundo:
    def __init__(self, variante, cap, notas):
        self.filas = [list(f) for f in variante['mapa']]
        self.alto = len(self.filas)
        self.ancho = len(self.filas[0]) if self.filas else 0
        self.c = self.f = 0
        self.boya = None
        muelle = False
        for f, fila in enumerate(self.filas):
            for c, ch in enumerate(fila):
                if ch == 'M' and not muelle:
                    self.c, self.f, muelle = c, f, True
                if ch == 'B' and self.boya is None:
                    self.boya = (c, f)
        self.rumbo = variante.get('rumbo', 'este')
        self.pasos = 0
        self.tope = cap['pasosTope']
        self.bitacora = []
        self.registro = []
        self.entregado = None
        self.notas = list(notas)
        self.respuestas = list(variante.get('respuestas') or cap.get('respuestas') or [])
        self.tallas = variante.get('tallas') or {}
        self.brillos = variante.get('brillo') or {}
        self.muestras = variante.get('muestras') or {}
        self.eventos = []
        self.truncado = False

    def ev(self, t, **datos):
        if len(self.eventos) >= MAX_EVENTOS:
            self.truncado = True
            return
        datos['t'] = t
        datos['step'] = self.pasos
        self.eventos.append(datos)

    def char(self, c, f):
        if 0 <= f < self.alto and 0 <= c < self.ancho:
            return self.filas[f][c]
        return None

    def delante(self):
        dc, df = DELTA[self.rumbo]
        return self.c + dc, self.f + df

    def poner(self, c, f, ch):
        self.filas[f][c] = ch
        self.ev('cell', c=c, f=f, kind=ch)

    def tipo(self, c, f):
        ch = self.char(c, f)
        return NOMBRES.get(ch, 'fuera') if ch is not None else 'fuera'


def _crear_verbos(m, cap):
    def paso():
        m.pasos += 1
        if m.pasos > m.tope:
            raise _Corte('pasos')

    def llena():
        return len(m.bitacora) >= MAX_DECIR

    def avanzar():
        paso()
        c, f = m.delante()
        ch = m.char(c, f)
        if ch is None or ch == 'x':
            raise OrillaError('Nilo no puede avanzar: es el borde del mapa.')
        if ch == '#':
            raise OrillaError('Nilo no puede avanzar: hay orilla.')
        if ch == 'R':
            raise OrillaError('Nilo no puede avanzar: hay una rama.')
        m.c, m.f = c, f
        m.ev('move', c=c, f=f, rumbo=m.rumbo)

    def girar(delta):
        paso()
        m.rumbo = RUMBOS[(RUMBOS.index(m.rumbo) + delta) % 4]
        m.ev('turn', rumbo=m.rumbo)

    def girar_izquierda():
        girar(-1)

    def girar_derecha():
        girar(1)

    def mirar():
        return m.tipo(*m.delante())

    def aqui():
        return m.tipo(m.c, m.f)

    def columna():
        return m.c

    def fila():
        return m.f

    def posicion():
        return (m.c, m.f)

    def agua_baja():
        return m.char(m.c, m.f) == '~'

    def hay_rama():
        return m.char(*m.delante()) == 'R'

    def frente_libre():
        return m.char(*m.delante()) in PISABLES

    def brillo():
        if m.char(m.c, m.f) != 'L':
            return 0
        return int(m.brillos.get(f'{m.c},{m.f}', 0))

    def decir(mensaje):
        paso()
        if not isinstance(mensaje, (str, int, float)):
            raise OrillaError('decir solo acepta texto, números o True/False. Convierte el valor con str().')
        if llena():
            raise OrillaError('La bitácora está llena: decir admite hasta 200 líneas.')
        texto = str(mensaje)[:MAX_LINEA]
        m.bitacora.append(texto)
        m.ev('say', text=texto)

    def pedir(pregunta):
        paso()
        if not isinstance(pregunta, str):
            raise OrillaError('pedir necesita un texto como pregunta.')
        if not m.respuestas:
            raise OrillaError('Ya no quedan respuestas para pedir().')
        if llena():
            raise OrillaError('La bitácora está llena: decir admite hasta 200 líneas.')
        texto = pregunta[:MAX_LINEA]
        m.bitacora.append(texto)
        m.ev('say', text=texto)
        return m.respuestas.pop(0)

    def recoger():
        paso()
        if m.char(m.c, m.f) != 'F':
            raise OrillaError('Aquí no hay pez que recoger.')
        talla = str(m.tallas.get(f'{m.c},{m.f}', 1))
        m.poner(m.c, m.f, '.')
        return talla

    def limpiar():
        paso()
        c, f = m.delante()
        if m.char(c, f) != 'R':
            raise OrillaError('Delante de Nilo no hay rama que limpiar.')
        m.poner(c, f, '.')

    def sembrar():
        paso()
        if m.char(m.c, m.f) != '~':
            raise OrillaError('Solo se puede sembrar en agua baja vacía.')
        m.poner(m.c, m.f, 'J')

    def entregar(cosas):
        paso()
        if not isinstance(cosas, list) or not all(isinstance(x, str) for x in cosas):
            raise OrillaError('entregar necesita una lista de textos.')
        lugares = cap.get('entregaEn') or ['B']
        if m.char(m.c, m.f) not in lugares:
            raise OrillaError('Aquí no se puede entregar: la entrega es en ' +
                              ('la boya.' if lugares == ['B'] else 'el muelle.'))
        m.entregado = list(cosas)
        m.ev('give', items=list(cosas))

    def medir():
        paso()
        ch = m.char(m.c, m.f)
        if ch == 'S':
            raise OrillaError('El terreno está seco: aquí no se puede medir.')
        if ch != '*':
            raise OrillaError('Aquí no hay muestra que medir.')
        dato = m.muestras.get(f'{m.c},{m.f}') or {'especie': 'desconocida', 'talla': 0}
        m.poner(m.c, m.f, '.')
        return {'especie': dato['especie'], 'talla': dato['talla']}

    def registrar(ficha):
        paso()
        if not isinstance(ficha, dict):
            raise OrillaError('registrar necesita un diccionario.')
        claves = cap.get('clavesRegistro')
        if claves and set(ficha.keys()) != set(claves):
            raise OrillaError('La ficha debe tener exactamente las claves: ' + ', '.join(claves) + '.')
        for k, v in ficha.items():
            if not isinstance(k, str) or not (v is None or isinstance(v, (str, int, float))):
                raise OrillaError('La ficha solo puede guardar textos y números.')
        copia = dict(ficha)
        m.registro.append(copia)
        m.ev('record', ficha=dict(copia))

    def anotar(linea):
        paso()
        if not isinstance(linea, str):
            raise OrillaError('anotar necesita un texto.')
        if len(m.notas) >= MAX_DECIR:
            raise OrillaError('La bitácora de la cuenca está llena.')
        texto = linea[:MAX_LINEA]
        m.notas.append(texto)
        m.ev('note', text=texto)

    def leer_notas():
        return list(m.notas)

    return {k: v for k, v in locals().items() if k in (
        'avanzar', 'girar_izquierda', 'girar_derecha', 'mirar', 'aqui', 'columna',
        'fila', 'posicion', 'agua_baja', 'hay_rama', 'frente_libre', 'brillo', 'decir',
        'pedir', 'recoger', 'limpiar', 'sembrar', 'entregar', 'medir', 'registrar',
        'anotar', 'leer_notas')}


# --------------------------------------------------------------------------
# Objetivos
# --------------------------------------------------------------------------

def _json(x):
    return json.dumps(x, ensure_ascii=False, separators=(',', ':'))


def _evaluar(obj, m, h):
    """Devuelve None si se cumple, o una frase con lo que falló."""
    t = obj['t']
    fallo = obj.get('fallo')
    if t == 'estar_en':
        if obj.get('en') == 'B':
            ok = m.boya is not None and (m.c, m.f) == m.boya
            return None if ok else (fallo or 'Nilo no llegó a la boya.')
        ok = (m.c, m.f) == (obj['c'], obj['f'])
        return None if ok else (fallo or 'Nilo no llegó a la casilla pedida.')
    if t == 'rumbo':
        return None if m.rumbo == obj['valor'] else (fallo or f"Nilo debía mirar al {obj['valor']}.")
    if t == 'bitacora_igual':
        if m.bitacora == obj['lineas']:
            return None
        return fallo or f"La bitácora debía ser {_json(obj['lineas'])} y fue {_json(m.bitacora)}."
    if t == 'bitacora_contiene':
        return None if any(obj['texto'] in x for x in m.bitacora) else (
            fallo or f"La bitácora debía contener {obj['texto']}.")
    if t == 'bitacora_termina_en':
        if m.bitacora and m.bitacora[-1] == obj['texto']:
            return None
        return fallo or f"La bitácora debía terminar en {obj['texto']}."
    if t == 'mapa_igual':
        for f, fila in enumerate(obj['patron']):
            for c, ch in enumerate(fila):
                if ch != '?' and m.char(c, f) != ch:
                    return fallo or 'El mapa final no quedó como pedía el tramo.'
        return None
    if t == 'celdas':
        n = sum(fila.count(obj['simbolo']) for fila in m.filas)
        if n < obj.get('min', 0) or n > obj.get('max', 10 ** 9):
            return fallo or 'El mapa final no quedó como pedía el tramo.'
        return None
    if t == 'entregado_igual':
        if m.entregado == obj['lista']:
            return None
        if m.entregado is None:
            return fallo or 'Nilo no entregó nada.'
        return fallo or f'La lista entregada fue {_json(m.entregado)}.'
    if t == 'registro_igual':
        return None if m.registro == obj['fichas'] else (
            fallo or 'El cuaderno no tiene las fichas que pedía el tramo.')
    if t == 'notas_contienen':
        return None if any(obj['texto'] in x for x in m.notas) else (
            fallo or f"Las notas deben contener la palabra {obj['texto']}.")
    if t == 'pasos_max':
        return None if m.pasos <= obj['n'] else (fallo or 'Nilo hizo más pasos de los permitidos.')
    if t == 'usa_llamada':
        return None if obj['nombre'] in h['llamadas'] else (
            fallo or f"El programa debía llamar a {obj['nombre']}().")
    if t == 'todo':
        for sub in obj['objetivos']:
            r = _evaluar(sub, m, h)
            if r:
                return r
        return None
    return 'El objetivo del tramo no es válido.'


# --------------------------------------------------------------------------
# Ejecución
# --------------------------------------------------------------------------

def _hacer_traza(estado):
    """Cuenta eventos de línea y de llamada del código del alumno.

    En CPython 3.12 los eventos `opcode` no llegan a la función de traza, pero
    `line` sí se emite también al saltar hacia atrás en un bucle, así que
    `while True: pass` se corta igual. El tipo de corte sigue llamándose
    'opcodes' porque la interfaz ya lo conoce con ese nombre.
    """
    def contar():
        estado['n'] += 1
        if estado['n'] > PRESUPUESTO_EVENTOS:
            raise _Corte('opcodes')

    def local(frame, evento, arg):
        if evento == 'line':
            contar()
        return local

    def global_(frame, evento, arg):
        if frame.f_code.co_filename == TRAZA_ARCHIVO:
            contar()
            return local
        return None
    return global_


TRADUCCION = [
    (ZeroDivisionError, 'No se puede dividir entre cero.'),
    (IndexError, 'Ese índice no existe en la lista.'),
    (RecursionError, 'La función se llamó a sí misma demasiadas veces.'),
    (MemoryError, 'El programa necesitó demasiada memoria.'),
    (AttributeError, 'Ese valor no tiene ese método.'),
    (ValueError, 'Ese valor no se puede convertir.'),
]


def _traducir(e, cap):
    if isinstance(e, _Corte):
        if e.tipo == 'pasos':
            return f"Nilo hizo demasiados movimientos. El límite de este tramo es {cap['pasosTope']}."
        return 'El programa no terminó. Si hay un bucle, necesita una condición que deje de cumplirse.'
    if isinstance(e, OrillaError):
        return str(e)
    if isinstance(e, UnboundLocalError):
        return f"`{getattr(e, 'name', None) or 'ese nombre'}` se usa antes de tener un valor."
    if isinstance(e, NameError):
        return f"`{getattr(e, 'name', None) or 'ese nombre'}` no existe en este tramo."
    if isinstance(e, KeyError):
        return f"La clave {e.args[0]!r} no existe en el diccionario." if e.args else 'Esa clave no existe.'
    if isinstance(e, TypeError):
        return 'Esa operación o llamada no coincide con los tipos o argumentos que espera.'
    for tipo, texto in TRADUCCION:
        if isinstance(e, tipo):
            return texto
    return 'Python se detuvo por un error inesperado.'


def _info_error(e, cap):
    tb = e.__traceback__
    primero = ultimo = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == TRAZA_ARCHIVO:
            primero = primero or tb
            ultimo = tb
        tb = tb.tb_next
    linea = ultimo.tb_lineno if ultimo else None
    texto = ''
    try:
        if ultimo is not None:
            ultimo.tb_next = None
        texto = ''.join(traceback.format_exception(type(e), e, primero))[-2000:]
    except Exception:
        texto = repr(e)
    tipo = e.tipo if isinstance(e, _Corte) else ('orilla' if isinstance(e, OrillaError) else 'python')
    return {'tipo': tipo, 'mensaje': _traducir(e, cap), 'linea': linea, 'traceback': texto}


def _profundidad():
    n, f = 0, sys._getframe()
    while f is not None:
        n += 1
        f = f.f_back
    return n


def _correr_variante(codigo_obj, arbol_hechos, cap, variante, notas, indice):
    m = Mundo(variante, cap, notas)
    abiertos = cap['abiertos']
    builtins = {n: BUILTINS_REALES[n] for n in abiertos['builtins'] if n in BUILTINS_REALES}
    if 'try' in abiertos['constructos']:
        builtins['OrillaError'] = OrillaError
    verbos = _crear_verbos(m, cap)
    glob = {'__builtins__': builtins, '__name__': '__orilla__'}
    glob.update({k: verbos[k] for k in abiertos['verbos'] if k in verbos})

    error = None
    estado = {'n': 0}
    limite = sys.getrecursionlimit()
    try:
        sys.setrecursionlimit(_profundidad() + 150)
        sys.settrace(_hacer_traza(estado))
        try:
            exec(codigo_obj, glob)
        finally:
            sys.settrace(None)
            sys.setrecursionlimit(limite)
    except BaseException as e:  # incluye _Corte
        if isinstance(e, (KeyboardInterrupt, SystemExit)):
            raise
        error = _info_error(e, cap)
        m.ev('error', message=error['mensaje'], line=error['linea'])
    m.ev('done')

    fallo = None
    if error is not None:
        fallo = error['mensaje']
    else:
        fallo = _evaluar({'t': 'todo', 'objetivos': cap['objetivos'] + (variante.get('objetivos') or [])}, m, arbol_hechos)
    return {
        'indice': indice,
        'passed': fallo is None,
        'steps': m.pasos,
        'events': m.eventos,
        'log': m.bitacora,
        'fail': fallo,
        'error': error,
        'truncated': m.truncado,
        'final': {'mapa': [''.join(f) for f in m.filas],
                  'nilo': {'c': m.c, 'f': m.f, 'rumbo': m.rumbo}},
        'registro': m.registro,
        'entregado': m.entregado,
        'notas': m.notas,
    }


def _estrellas(cap, variantes, h):
    if not variantes or not all(v['passed'] for v in variantes):
        return 0
    estrellas = 1
    par = cap.get('pasosPar')
    if par is None:
        return 1
    if all(v['steps'] <= par for v in variantes):
        estrellas = 2
    if estrellas == 2 and _maestria_ok(cap, h):
        estrellas = 3
    if not _maestria_ok(cap, h):
        estrellas = min(estrellas, cap.get('techoSinMaestria', 2))
    return estrellas


def _ejecutar(codigo, cap):
    if not isinstance(codigo, str) or len(codigo) > MAX_CODIGO:
        return {'gate': {'ok': False, 'mensaje': 'El programa es demasiado largo.', 'linea': 1, 'leccion': None},
                'variants': [], 'stars': 0, 'passed': False, 'error': None}
    arbol, hallazgo = _compuerta(codigo, cap)
    if hallazgo is not None:
        return {'gate': {'ok': False, 'mensaje': hallazgo['mensaje'], 'linea': hallazgo['linea'],
                         'leccion': hallazgo['leccion']},
                'variants': [], 'stars': 0, 'passed': False, 'error': None}
    h = _hechos(arbol)
    codigo_obj = compile(arbol, TRAZA_ARCHIVO, 'exec')
    notas = cap.get('notas') or []
    variantes = []
    for i, variante in enumerate(cap['variantes']):
        r = _correr_variante(codigo_obj, h, cap, variante, notas, i)
        variantes.append(r)
        if r['error'] and r['error']['tipo'] == 'opcodes':
            break  # un bucle infinito no se repite en cada variante
    pasadas = len(variantes) == len(cap['variantes']) and all(v['passed'] for v in variantes)
    fallida = next((v for v in variantes if not v['passed']), None)
    mostrar = fallida['indice'] if fallida else 0
    return {
        'gate': {'ok': True},
        'variants': variantes,
        'show': mostrar,
        'stars': _estrellas(cap, variantes, h) if pasadas else 0,
        'passed': pasadas,
        'steps': max((v['steps'] for v in variantes), default=0),
        'error': (fallida or {}).get('error'),
        'notas': variantes[-1]['notas'] if variantes else list(notas),
    }


def run_json(codigo, tramo_json):
    try:
        return json.dumps(_ejecutar(codigo, json.loads(tramo_json)), ensure_ascii=False)
    except Exception as e:  # fallo del motor, no del alumno
        return json.dumps({
            'gate': {'ok': True}, 'variants': [], 'show': 0, 'stars': 0, 'passed': False,
            'steps': 0, 'notas': [],
            'error': {'tipo': 'motor', 'mensaje': 'El motor de Orilla falló de forma inesperada.',
                      'linea': None, 'traceback': repr(e)}}, ensure_ascii=False)
