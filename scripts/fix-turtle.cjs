const fs = require("fs");
const path = "c:/Users/USUARIO/python-pe1-academy/public/turtle_compat.py";
let content = fs.readFileSync(path, "utf8");
content = content.replace("import math\n", "import math\nimport sys\n");
const endMarker = "def clear_commands():\n    global _commands\n    _commands = []";
const registration = `
def mainloop():
    pass


def exitonclick():
    pass


def clear_commands():
    global _commands
    _commands = []

# Registrar el módulo para que "import turtle as t" funcione
sys.modules["turtle"] = sys.modules[__name__]
`;
content = content.replace(endMarker, registration);
fs.writeFileSync(path, content, "utf8");
console.log("turtle_compat.py updated");
