export async function fetchDogImages() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random/18');
        const { message } = await response.json();
        return message;
    } catch (error) {
        console.error('Fout bij het ophalen van random hond images:', error);
        return [];
    }
}

export async function fetchRandomImages() {
    try {
        const response = await fetch('https://picsum.photos/v2/list?page=2&limit=18');
        const data = await response.json();
        return data.map(image => image.download_url);
    } catch (error) {
        console.error('Fout bij het ophalen van random images:', error);
        return [];
    }
}