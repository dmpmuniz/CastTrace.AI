class MovieTimelineApp {
    constructor() {
        // Elementos da UI
        this.movieInput = document.getElementById("movieInput");
        this.plotInput = document.getElementById("plotInput");
        this.searchButton = document.getElementById("searchButton");
        this.plotSearchButton = document.getElementById("plotSearchButton");
        this.nameTab = document.getElementById("nameTab");
        this.plotTab = document.getElementById("plotTab");
        this.nameSearch = document.getElementById("nameSearch");
        this.plotSearch = document.getElementById("plotSearch");
        this.suggestions = document.getElementById("suggestions");
        this.suggestionsList = document.getElementById("suggestionsList");
        this.loading = document.getElementById("loading");
        this.results = document.getElementById("results");
        this.movieInfo = document.getElementById("movieInfo");
        this.timeline = document.getElementById("timeline");
        this.error = document.getElementById("error");
        
        // Configuração do proxy (atualize com seu URL real)
        this.PROXY_URL = "https://castraceai.dmp-muniz.workers.dev";
        
        // Inicializa eventos
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Eventos de busca
        this.searchButton.addEventListener("click", () => this.searchMovie());
        this.plotSearchButton.addEventListener("click", () => this.searchByPlot());
        
        // Eventos de teclado
        this.movieInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.searchMovie();
        });
        this.plotInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.searchByPlot();
        });
        
        // Eventos das abas
        this.nameTab.addEventListener("click", () => this.switchTab("name"));
        this.plotTab.addEventListener("click", () => this.switchTab("plot"));
    }
    
    switchTab(tab) {
        if (tab === "name") {
            this.nameTab.classList.add("active");
            this.plotTab.classList.remove("active");
            this.nameSearch.classList.remove("hidden");
            this.plotSearch.classList.add("hidden");
            this.suggestions.classList.add("hidden");
        } else {
            this.plotTab.classList.add("active");
            this.nameTab.classList.remove("active");
            this.plotSearch.classList.remove("hidden");
            this.nameSearch.classList.add("hidden");
        }
        this.hideResults();
        this.hideError();
    }
    
    async searchMovie(movieTitle = null) {
        const movieName = movieTitle || this.movieInput.value.trim();
        if (!movieName) {
            this.showError("Por favor, digite o nome de um filme.");
            return;
        }
        
        this.showLoading();
        this.hideError();
        this.hideResults();
        this.suggestions.classList.add("hidden");
        
        try {
            const movieData = await this.getMovieData(movieName);
            this.displayResults(movieData);
        } catch (error) {
            console.error("Erro na busca:", error);
            this.showError(error.message || "Erro desconhecido ao buscar filme");
        } finally {
            this.hideLoading();
        }
    }
    
    async searchByPlot() {
        const plotText = this.plotInput.value.trim();
        if (!plotText) {
            this.showError("Por favor, digite uma sinopse.");
            return;
        }
        
        this.showLoading();
        this.hideError();
        this.hideResults();
        
        try {
            const suggestions = await this.getMovieSuggestions(plotText);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error("Erro na busca por sinopse:", error);
            this.showError(error.message || "Erro desconhecido ao buscar filmes por sinopse");
        } finally {
            this.hideLoading();
        }
    }
    
    async getMovieSuggestions(plotText) {
        const prompt = `
        Com base na seguinte sinopse, sugira 3 filmes que correspondam à descrição. Retorne APENAS um JSON válido com:
        {
            "suggestions": [
                {
                    "title": "Título do filme",
                    "year": "Ano de lançamento",
                    "confidence": "alta/média/baixa"
                }
            ]
        }
        
        Sinopse: "${plotText}"
        
        Ordene por relevância (mais provável primeiro).
        `;
        
        const response = await fetch(this.PROXY_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Origin": "https://dmpmuniz.github.io"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.error?.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Resposta da API não contém JSON válido");
        
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error("Parse error:", parseError, "Content:", content);
            throw new Error("Erro ao interpretar sugestões de filmes");
        }
    }
    
    displaySuggestions(data) {
        if (!data.suggestions || data.suggestions.length === 0) {
            this.showError("Nenhuma sugestão de filme encontrada para esta sinopse");
            return;
        }
        
        this.suggestionsList.innerHTML = "";
        
        data.suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement("div");
            suggestionElement.className = "suggestion-item";
            suggestionElement.innerHTML = `
                <div class="suggestion-title">${suggestion.title}</div>
                <div class="suggestion-year">${suggestion.year} - Confiança: ${suggestion.confidence}</div>
            `;
            
            suggestionElement.addEventListener("click", () => {
                this.searchMovie(suggestion.title);
            });
            
            this.suggestionsList.appendChild(suggestionElement);
        });
        
        this.suggestions.classList.remove("hidden");
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
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Origin": "https://dmpmuniz.github.io"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.error?.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Resposta da API não contém JSON válido");
        
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error("Parse error:", parseError, "Content:", content);
            throw new Error("Erro ao interpretar dados do filme");
        }
    }
    
    async getActorPhoto(actorName) {
        // Para demonstração, vamos usar um serviço de placeholder
        // Em produção, você poderia usar uma API de busca de imagens
        const encodedName = encodeURIComponent(actorName);
        
        // Usando um serviço de placeholder que gera avatares baseados no nome
        return `https://ui-avatars.com/api/?name=${encodedName}&size=120&background=667eea&color=fff&bold=true`;
    }
    
    displayResults(movieData) {
        if (!movieData || !movieData.title) {
            this.showError("Filme não encontrado ou dados incompletos");
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
                <div class="movie-year">${movieData.year || "Ano desconhecido"}</div>
            </div>
            <div class="movie-details">
                ${movieData.director ? `<p><strong>Diretor:</strong> ${movieData.director}</p>` : ""}
                ${movieData.genre ? `<p><strong>Gênero:</strong> ${movieData.genre}</p>` : ""}
                ${movieData.plot ? `<p><strong>Sinopse:</strong> ${movieData.plot}</p>` : ""}
            </div>
        `;
    }
    
    async displayTimeline(actors) {
        if (!actors || actors.length === 0) {
            this.timeline.innerHTML = "<div class=\"no-actors\">Nenhum ator principal encontrado</div>";
            return;
        }
        
        const validActors = actors
            .filter(a => a.name && a.birthDate)
            .sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
        
        if (validActors.length === 0) {
            this.timeline.innerHTML = "<div class=\"no-actors\">Datas de nascimento indisponíveis</div>";
            return;
        }
        
        let timelineHTML = `
            <h3 class="timeline-title">Linha do Tempo dos Atores</h3>
            <div class="timeline-container">
                <div class="timeline-line"></div>
        `;
        
        for (let i = 0; i < validActors.length; i++) {
            const actor = validActors[i];
            const birthDate = new Date(actor.birthDate);
            const birthYear = birthDate.getFullYear();
            const deathYear = actor.deathDate ? new Date(actor.deathDate).getFullYear() : null;
            const age = this.calculateAge(actor.birthDate, actor.deathDate);
            const positionClass = i % 2 === 0 ? "left" : "right";
            const photoUrl = await this.getActorPhoto(actor.name);
            
            timelineHTML += `
                <div class="timeline-item ${positionClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <img src="${photoUrl}" alt="${actor.name}" class="actor-photo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&size=120&background=cccccc&color=666'">
                        <div class="actor-info">
                            <div class="actor-name">${actor.name}</div>
                            <div class="actor-dates">
                                ${birthYear}${deathYear ? ` — ${deathYear}` : ""}
                                ${age !== null ? ` (${deathYear ? `Viveu ${age} anos` : `${age} anos`})` : ""}
                            </div>
                            ${actor.character ? `<div class="actor-character"><strong>Personagem:</strong> ${actor.character}</div>` : ""}
                        </div>
                    </div>
                </div>
            `;
        }
        
        timelineHTML += "</div>";
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
        this.loading.classList.remove("hidden");
        this.loading.textContent = "Buscando informações...";
    }
    
    hideLoading() {
        this.loading.classList.add("hidden");
    }
    
    showResults() {
        this.results.classList.remove("hidden");
    }
    
    hideResults() {
        this.results.classList.add("hidden");
    }
    
    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove("hidden");
    }
    
    hideError() {
        this.error.classList.add("hidden");
    }
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", () => {
    new MovieTimelineApp();
});

