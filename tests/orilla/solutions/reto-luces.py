valores = []
for i in range(3):
    avanzar()
    valores.append(brillo())
girar_derecha()
avanzar()
avanzar()
girar_derecha()
for i in range(3):
    avanzar()
    if brillo() > 0:
        valores.append(brillo())
for i in range(len(valores)):
    for j in range(len(valores) - 1 - i):
        if valores[j] < valores[j + 1]:
            aux = valores[j]
            valores[j] = valores[j + 1]
            valores[j + 1] = aux
texto = []
for v in valores:
    texto.append(str(v))
entregar(texto)
