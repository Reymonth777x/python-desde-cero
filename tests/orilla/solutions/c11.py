while frente_libre():
    avanzar()
    try:
        ficha = medir()
        registrar({'especie': ficha['especie'], 'talla': ficha['talla'], 'columna': posicion()[0]})
    except OrillaError:
        pass
