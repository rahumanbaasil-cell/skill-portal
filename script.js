function saveUser() {
    var name = document.getElementById("name").value;
    var skills = document.getElementById("skills").value;
    var imageFile = document.getElementById("imageInput").files[0];
    var docFile = document.getElementById("docInput").files[0];

    if (!name || !skills) {
        alert("Enter name and skills");
        return;
    }

    var imageReader = new FileReader();
    var docReader = new FileReader();

    var imageData = "";
    var docData = "";
    var docName = "";

    imageReader.onload = function() {
        imageData = imageReader.result;
        saveData();
    };

    docReader.onload = function() {
        docData = docReader.result;
        docName = docFile.name;
        saveData();
    };

    function saveData() {
        if ((imageFile && !imageData) || (docFile && !docData)) return;

        var users = JSON.parse(localStorage.getItem("users")) || [];

        users.push({
            name: name,
            skills: skills,
            image: imageData,
            document: docData,
            documentName: docName
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("✅ Project Submitted Successfully");

        document.getElementById("name").value = "";
        document.getElementById("skills").value = "";

        displayUsers();
    }

    if (imageFile) imageReader.readAsDataURL(imageFile);
    if (docFile) docReader.readAsDataURL(docFile);
    if (!imageFile && !docFile) saveData();
}

function displayUsers() {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var output = document.getElementById("output");
    output.innerHTML = "";

    users.forEach(function(user, index) {
        output.innerHTML += `
            <div class="user-card">
                <h3>🆔 ${index + 1}: ${user.name}</h3>
                <img src="${user.image || ''}">
                <p>💡 Skills: ${user.skills}</p>
                
                ${user.document ? 
                    `<button onclick="openDocument('${user.document}')">📂 Open Document</button>` 
                    : `<p>No document uploaded</p>`}

                <button onclick="deleteUser(${index})" style="background:red;margin-top:10px;">❌ Delete</button>
            </div>
        `;
    });
}

function deleteUser(index) {
    var users = JSON.parse(localStorage.getItem("users")) || [];

    if (confirm("Are you sure you want to delete this profile?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        displayUsers();
    }
}

function openDocument(docData) {
    var newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
            <title>Document Viewer</title>
        </head>
        <body style="margin:0">
            <button onclick="window.close()" style="position:fixed;top:10px;right:10px;padding:10px;background:red;color:white;border:none;">❌ Close</button>
            <iframe src="${docData}" width="100%" height="100%"></iframe>
        </body>
        </html>
    `);
}