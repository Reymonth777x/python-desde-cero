tallas = []
for i in range(3):
    avanzar()
    tallas.append(recoger())
avanzar()
for i in range(len(tallas)):
    for j in range(len(tallas) - 1 - i):
        if tallas[j] > tallas[j + 1]:
            aux = tallas[j]
            tallas[j] = tallas[j + 1]
            tallas[j + 1] = aux
entregar(tallas)
