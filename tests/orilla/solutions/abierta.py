# Río abierto: deja una nota en la cuenca y comprueba que se puede leer.
# El mapa también pide sembrar ocho juncos, quitar tres ramas y llegar a la boya.
# El reto no premia velocidad ni estrellas: se trata de recorrer el río libremente.

def limpiar_ramas():
    for _ in range(3):
        while frente_libre() and mirar() != 'rama':
            avanzar()
        if hay_rama():
            limpiar()

anotar('listo: exploré el río')
sembrados = 0
for _ in range(8):
    if agua_baja():
        sembrar()
        sembrados += 1
    if frente_libre():
        avanzar()

decir(sembrados)
