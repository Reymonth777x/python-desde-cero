while aqui() != 'boya':
    if frente_libre():
        avanzar()
    else:
        girar_derecha()
        if not frente_libre():
            girar_izquierda()
            girar_izquierda()
