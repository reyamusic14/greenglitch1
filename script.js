.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.input-section {
    margin: 20px 0;
    display: flex;
    gap: 10px;
}

.image-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.image-card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
}

.image-card img {
    width: 100%;
    height: auto;
    border-radius: 4px;
}

input, button {
    padding: 10px;
    border-radius: 4px;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
} 
