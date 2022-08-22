import os

tn = os.path.join("templates", "notary")
dirs = ["documents", "templates", tn]
copies = {
    "templates": ["ABC Church Trust v3.docx", "abc.html"],
    tn: ["*"]
}
syms = {
    ".": ["_cat.py"],
    "js": ["cat"],
    "css": ["cat.css"],
    "html": ["cat"]
}
model = {
    "ctcat.model": ["*"]
}
routes = {
    "/_cat": "_cat.py",
    "/templates": "templates",
    "/documents": "documents"
}
requires = ["ctuser"]
