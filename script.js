class MovieTimelineApp {
    constructor() {
        this.movieInput = document.getElementById('movieInput');
        this.searchButton = document.getElementById('searchButton');
        this.loading = document.getElementById('loading');
        this.results = document.getElementById('results');
        this.movieInfo = document.getElementById('movieInfo');
        this.timeline = document.getElementById('timeline');
        this.error = document.getElementById('error');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchMovie());
        this.movieInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMovie();
            }
        });
    }
    
    async searchMovie() {
        const movieName = this.movieInput.value.trim();
        if (!movieName) {
            this.showError('Por favor, digite o nome de um filme.');
            return;
        }
        
        this.showLoading();
        this.hideError();
        this.hideResults();
        
        try {
            const movieData = await this.getMovieDataFromGroq(movieName);
            this.displayResults(movieData);
        } catch (error) {
            console.error('Erro ao buscar dados do filme:', error);
            this.showError('Erro ao buscar informações do filme. Tente novamente.');
        } finally {
            this.hideLoading();
        }
    }
    
    async getMovieDataFromGroq(movieName) {
        const prompt = `
        Preciso de informações sobre o filme "${movieName}". Por favor, retorne um JSON válido com as seguintes informações:
        
        {
            "title": "título do filme",
            "year": "ano de lançamento",
            "director": "diretor",
            "genre": "gênero",
            "plot": "sinopse breve",
            "actors": [
                {
                    "name": "nome do ator",
                    "birthDate": "data de nascimento no formato YYYY-MM-DD",
                    "deathDate": "data de morte no formato YYYY-MM-DD ou null se ainda vivo",
                    "character": "personagem interpretado"
                }
            ]
        }
        
        Inclua apenas os atores principais (máximo 8). Se não souber alguma data exata, use null. 
        Retorne APENAS o JSON, sem texto adicional.
        `;
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Remove possíveis marcadores de código markdown
        const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        try {
            return JSON.parse(jsonContent);
        } catch (parseError) {
            console.error('Erro ao fazer parse do JSON:', parseError);
            console.error('Conteúdo recebido:', content);
            throw new Error('Resposta da API não está em formato JSON válido');
        }
    }
    
    displayResults(movieData) {
        this.displayMovieInfo(movieData);
        this.displayTimeline(movieData.actors);
        this.showResults();
    }
    
    displayMovieInfo(movieData) {
        this.movieInfo.innerHTML = `
            <div class="movie-title">${movieData.title} (${movieData.year})</div>
            <div class="movie-details">
                <p><strong>Diretor:</strong> ${movieData.director}</p>
                <p><strong>Gênero:</strong> ${movieData.genre}</p>
                <p><strong>Sinopse:</strong> ${movieData.plot}</p>
            </div>
        `;
    }
    
    displayTimeline(actors) {
        if (!actors || actors.length === 0) {
            this.timeline.innerHTML = '<p>Nenhum ator encontrado para este filme.</p>';
            return;
        }
        
        // Ordena os atores por data de nascimento
        const sortedActors = actors
            .filter(actor => actor.birthDate)
            .sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
        
        let timelineHTML = '<h3 class="timeline-title">Timeline dos Atores Principais</h3><div class="timeline">';
        
        sortedActors.forEach((actor, index) => {
            const isLeft = index % 2 === 0;
            const birthYear = new Date(actor.birthDate).getFullYear();
            const deathYear = actor.deathDate ? new Date(actor.deathDate).getFullYear() : null;
            
            const age = this.calculateAge(actor.birthDate, actor.deathDate);
            const ageText = deathYear ? `Viveu ${age} anos` : `${age} anos`;
            
            const dateText = deathYear ? 
                `${birthYear} - ${deathYear}` : 
                `Nascido em ${birthYear}`;
            
            timelineHTML += `
                <div class="timeline-item ${isLeft ? 'left' : 'right'}">
                    <div class="timeline-content">
                        <div class="actor-name">${actor.name}</div>
                        <div class="actor-dates">${dateText}</div>
                        <div class="actor-age">${ageText}</div>
                        ${actor.character ? `<p><strong>Personagem:</strong> ${actor.character}</p>` : ''}
                    </div>
                </div>
            `;
        });
        
        timelineHTML += '</div>';
        this.timeline.innerHTML = timelineHTML;
    }
    
    calculateAge(birthDate, deathDate) {
        const birth = new Date(birthDate);
        const end = deathDate ? new Date(deathDate) : new Date();
        
        let age = end.getFullYear() - birth.getFullYear();
        const monthDiff = end.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    showLoading() {
        this.loading.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loading.classList.add('hidden');
    }
    
    showResults() {
        this.results.classList.remove('hidden');
    }
    
    hideResults() {
        this.results.classList.add('hidden');
    }
    
    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
    }
    
    hideError() {
        this.error.classList.add('hidden');
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MovieTimelineApp();
});

// Função para limpar a chave da API (útil para desenvolvimento)
function clearAPIKey() {
    alert('Aplicação configurada para usar API do Groq Cloud.');
}

