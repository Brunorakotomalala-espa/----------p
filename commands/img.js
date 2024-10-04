const axios = require('axios');
const sendMessage = require('../handles/sendMessage'); // Importer la fonction sendMessage

// Déclaration de l'URL de base de votre API Flask
const BASE_API_URL = 'https://mon-image-to-txt.onrender.com/img2txt';

module.exports = async (senderId, userText) => {
    // Extraire l'URL de l'image en retirant le préfixe 'img' et en supprimant les espaces superflus
    const imageUrl = userText.slice(3).trim();

    // Vérifier si l'URL est vide
    if (!imageUrl) {
        await sendMessage(senderId, 'Veuillez fournir une URL d\'image pour que je puisse extraire le texte.');
        return;
    }

    try {
        // Envoyer un message de confirmation que la requête est en cours de traitement
        await sendMessage(senderId, "Image reçue, je prépare une réponse...");

        // Appeler l'API Flask img2txt avec l'URL de l'image
        const apiUrl = BASE_API_URL;
        const response = await axios.post(apiUrl, {
            image_url: imageUrl
        });

        // Récupérer la réponse de l'API Flask
        const extractedText = response.data.extracted_text;

        // Attendre 2 secondes avant d'envoyer la réponse pour un délai naturel
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Envoyer le texte extrait à l'utilisateur
        if (extractedText) {
            await sendMessage(senderId, `Voici le texte extrait de l'image: \n${extractedText}`);
        } else {
            await sendMessage(senderId, 'Désolé, je n\'ai pas pu extraire de texte de cette image.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API img2txt:', error);

        // Envoyer un message d'erreur à l'utilisateur en cas de problème
        await sendMessage(senderId, 'Désolé, une erreur s\'est produite lors du traitement de l\'image.');
    }
};

// Ajouter les informations de la commande
module.exports.info = {
    name: "img",  // Le nom de la commande
    description: "Envoyer une URL d'image pour obtenir le texte extrait.",  // Description de la commande
    usage: "Envoyez 'img <URL de l'image>' pour obtenir le texte extrait."  // Comment utiliser la commande
};
