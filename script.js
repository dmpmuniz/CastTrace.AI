class MovieTimelineApp {
    constructor() {
        // Elementos da UI
        this.movieInput = document.getElementById('movieInput');
        this.searchButton = document.getElementById('searchButton');
        this.loading = document.getElementById('loading');
        this.results = document.getElementById('results');
        this.movieInfo = document.getElementById('movieInfo');
        this.timeline = document.getElementById('timeline');
        this.error = document.getElementById('error');
        
        // Configuração do proxy (atualize com seu URL real)
        this.PROXY_URL = "https://castraceai.dmp-muniz.workers.dev";
        
        // Inicializa eventos
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchMovie());
        this.movieInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchMovie();
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
            const movieData = await this.getMovieData(movieName);
            this.displayResults(movieData);
        } catch (error) {
            console.error('Erro na busca:', error);
            this.showError(error.message || 'Erro desconhecido ao buscar filme');
        } finally {
            this.hideLoading();
        }
    }
    
    async getMovieData(movieName) {
        const prompt = `
        Preciso de informações sobre o filme "${movieName}". Retorne APENAS um JSON válido com:
        {
            "title": "Título oficial",
            "year": "Ano de lançamento",
            "director": "Nome do diretor",
            "genre": "Gênero principal",
            "plot": "Sinopse breve",
            "actors": [
                {
                    "name": "Nome completo",
                    "birthDate": "YYYY-MM-DD",
                    "deathDate": "YYYY-MM-DD ou null",
                    "character": "Nome do personagem"
                }
            ]
        }
        Inclua apenas atores principais (máximo 5). Se não souber dados exatos, use null.
        `;
        
        const response = await fetch(this.PROXY_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Origin': 'https://dmpmuniz.github.io' // Seu domínio GitHub Pages
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 2000
            })
        });
        
        // Tratamento de erros HTTP
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.error?.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
        
        // Processamento da resposta
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Extração do JSON (robusto a markdown)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Resposta da API não contém JSON válido');
        
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error('Parse error:', parseError, 'Content:', content);
            throw new Error('Erro ao interpretar dados do filme');
        }
    }
    
    displayResults(movieData) {
        if (!movieData || !movieData.title) {
            this.showError('Filme não encontrado ou dados incompletos');
            return;
        }
        
        this.displayMovieInfo(movieData);
        this.displayTimeline(movieData.actors || []);
        this.showResults();
    }
    
    displayMovieInfo(movieData) {
        this.movieInfo.innerHTML = `
            <div class="movie-header">
                <h2 class="movie-title">${movieData.title}</h2>
                <div class="movie-year">${movieData.year || 'Ano desconhecido'}</div>
            </div>
            <div class="movie-details">
                ${movieData.director ? `<p><strong>Diretor:</strong> ${movieData.director}</p>` : ''}
                ${movieData.genre ? `<p><strong>Gênero:</strong> ${movieData.genre}</p>` : ''}
                ${movieData.plot ? `<p><strong>Sinopse:</strong> ${movieData.plot}</p>` : ''}
            </div>
        `;
    }
    
    displayTimeline(actors) {
        if (!actors || actors.length === 0) {
            this.timeline.innerHTML = '<div class="no-actors">Nenhum ator principal encontrado</div>';
            return;
        }
        
        // Processar atores com dados válidos
        const validActors = actors
            .filter(a => a.name && a.birthDate)
            .sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
        
        if (validActors.length === 0) {
            this.timeline.innerHTML = '<div class="no-actors">Datas de nascimento indisponíveis</div>';
            return;
        }
        
        let timelineHTML = `
            <h3 class="timeline-title">Linha do Tempo dos Atores</h3>
            <div class="timeline-container">
                <div class="timeline-line"></div>
        `;
        
        validActors.forEach((actor, index) => {
            const birthDate = new Date(actor.birthDate);
            const birthYear = birthDate.getFullYear();
            const deathYear = actor.deathDate ? new Date(actor.deathDate).getFullYear() : null;
            const age = this.calculateAge(actor.birthDate, actor.deathDate);
            const positionClass = index % 2 === 0 ? 'left' : 'right';
            
            timelineHTML += `
                <div class="timeline-item ${positionClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="actor-name">${actor.name}</div>
                        <div class="actor-dates">
                            ${birthYear}${deathYear ? ` — ${deathYear}` : ''}
                            ${age !== null ? ` (${deathYear ? `Viveu ${age} anos` : `${age} anos`})` : ''}
                        </div>
                        ${actor.character ? `<div class="actor-character"><strong>Personagem:</strong> ${actor.character}</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        timelineHTML += '</div>';
        this.timeline.innerHTML = timelineHTML;
    }
    
    calculateAge(birthDate, deathDate) {
        try {
            const birth = new Date(birthDate);
            const end = deathDate ? new Date(deathDate) : new Date();
            
            if (isNaN(birth)) return null;
            
            let age = end.getFullYear() - birth.getFullYear();
            const m = end.getMonth() - birth.getMonth();
            
            if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
                age--;
            }
            
            return age;
        } catch {
            return null;
        }
    }
    
    // Métodos de utilidade UI
    showLoading() {
        this.loading.classList.remove('hidden');
        this.loading.textContent = 'Buscando informações...';
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

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    new MovieTimelineApp();
});
