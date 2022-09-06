# ctcat
This package provides the interfaces, database models, request handlers, and format conversion logic for a web application that generates the legal documents associated with trusts.


# Back (Init Config)

    import os
    
    tn = os.path.join("templates", "notary")
    dirs = ["documents", "templates", tn, os.path.join("documents", "trust")]
    copies = {
        "templates": ["ABC Church Trust v3.docx", "abc.html"],
        tn: "*"
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
    cfg = {
        "build": {
            "debug": True
        }
    }
    requires = ["ctuser"]
    