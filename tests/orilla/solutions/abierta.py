girar_derecha()
avanzar()
girar_izquierda()
avanzar()
for fila in range(3):
    for paso in range(2):
        sembrar()
        avanzar()
    sembrar()
    if fila < 2:
        if fila % 2 == 0:
            girar_derecha()
            avanzar()
            girar_derecha()
        else:
            girar_izquierda()
            avanzar()
            girar_izquierda()
girar_derecha()
for i in range(10):
    avanzar()
girar_izquierda()
while aqui() != 'boya':
    if hay_rama():
        limpiar()
    avanzar()
anotar('listo')
