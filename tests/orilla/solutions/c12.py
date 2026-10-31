def estanque():
    girar_derecha()
    avanzar()
    sembrar()
    girar_derecha()
    avanzar()
    sembrar()
    girar_izquierda()
    avanzar()
    sembrar()
    girar_izquierda()
    avanzar()
    sembrar()
    girar_derecha()
    avanzar()

talla = ''
while frente_libre() or hay_rama():
    if hay_rama():
        limpiar()
    avanzar()
    if aqui() == 'pez':
        talla = recoger()
    if aqui() == 'muestra':
        muestra = medir()
        registrar({'especie': muestra['especie'], 'talla': muestra['talla'], 'columna': columna()})
estanque()
decir(talla)
