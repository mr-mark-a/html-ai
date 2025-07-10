// Comprehensive Translation System for Mark's Games
// This file contains all translations for the entire application

window.TranslationSystem = (function() {
    
    // Language mappings for button display
    const languages = {
        'en': '🇺🇸 EN',
        'es': '🇪🇸 ES',
        'fr': '🇫🇷 FR',
        'de': '🇩🇪 DE',
        'it': '🇮🇹 IT',
        'pt': '🇵🇹 PT',
        'ru': '🇷🇺 RU',
        'zh': '🇨🇳 ZH',
        'ja': '🇯🇵 JA',
        'ar': '🇸🇦 AR'
    };
    
    // Main translation dictionary
    const translations = {
        'en': {
            // Login page
            'password': 'Password',
            'login': 'Login',
            'tryForFree': 'Try for Free',
            'document_title': 'Cat & Mouse Game',
            
            // Games menu
            'marks_games': "Mark's Games",
            'cat_and_mouse_game': 'Cat and Mouse Game',
            'marks_race': "Mark's Race",
            
            // Loading page
            'loading': 'LOADING...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Cat and Mouse Game',
            'level': 'Level',
            'score': 'Score',
            'lives': 'Lives',
            'game_over': 'Game Over',
            'you_win': 'You Win!',
            'restart': 'Restart',
            'next_level': 'Next Level',
            'pause': 'Pause',
            'resume': 'Resume',
            'settings': 'Settings',
            'sound': 'Sound',
            'music': 'Music',
            'back_to_menu': 'Back to Menu',
            
            // Race Game
            'marks_race_title': "Mark's Race",
            'start_race': 'Start Race',
            'speed': 'Speed',
            'distance': 'Distance',
            'time': 'Time',
            'fuel': 'Fuel',
            'crash': 'Crash!',
            'finish_line': 'Finish Line!',
            'best_time': 'Best Time',
            'controls': 'Controls',
            'acceleration': 'Acceleration',
            'brake': 'Brake',
            'left': 'Left',
            'right': 'Right',
            
            // Metro app
            'metro_title': 'Metro',
            
            // Store app
            'store_title': 'Store',
            'coming_soon': 'Coming Soon...',
            'store_description': 'Exciting items and upgrades will be available here soon!',
            
            // Navigation Center
            'navigation_title': 'Navigation Center',
            'navigation_center': '🧭 Navigation Center',
            'navigation_subtitle': 'Choose your navigation tool',
            'web_navigators': 'Web Navigators',
            'mobile_apps': 'Mobile Navigation Apps',
            'specialized_navigation': 'Specialized Navigation',
            'google_maps': 'Google Maps',
            'google_maps_desc': "World's most popular mapping service",
            'openstreetmap': 'OpenStreetMap',
            'openstreetmap_desc': 'Free and open-source world map',
            'mapquest': 'MapQuest',
            'mapquest_desc': 'Reliable directions and maps',
            'bing_maps': 'Bing Maps',
            'bing_maps_desc': "Microsoft's mapping platform",
            'waze': 'Waze',
            'waze_desc': 'Community-driven traffic navigation',
            'apple_maps': 'Apple Maps',
            'apple_maps_desc': "Apple's built-in navigation app",
            'here_wego': 'HERE WeGo',
            'here_wego_desc': 'Offline maps and navigation',
            'citymapper': 'Citymapper',
            'citymapper_desc': 'Urban transit navigation',
            'marine_traffic': 'Marine Traffic',
            'marine_traffic_desc': 'Real-time ship tracking',
            'flight_radar': 'FlightRadar24',
            'flight_radar_desc': 'Live flight tracking',
            'alltrails': 'AllTrails',
            'alltrails_desc': 'Hiking and trail navigation',
            'metro_navigator': 'Metro Navigator',
           'metro_navigator_desc': 'Local metro system guide',
            
            // All Languages Page
            'all_languages_title': 'All Languages',
            'language_selector_subtitle': 'Choose your preferred language for Mark\'s Games',
            'total_languages': 'Total Languages',
            'translated_phrases': 'Translated Phrases',
            'coverage': 'Coverage',
            'quick_language_selection': 'Quick Language Selection',
            'available_languages': 'Available Languages',
            'features_title': 'Features',
            'instant_switching': 'Instant Switching',
            'instant_switching_desc': 'Switch languages instantly without page reload',
            'persistent_settings': 'Persistent Settings',
            'persistent_settings_desc': 'Your language preference is saved automatically',
            'game_integration': 'Game Integration',
            'game_integration_desc': 'All games support multilingual interface',
            'global_support': 'Global Support',
            'global_support_desc': 'RTL languages and cultural adaptations'
        },
        'es': {
            // Login page
            'password': 'Contraseña',
            'login': 'Iniciar Sesión',
            'tryForFree': 'Prueba Gratis',
            'document_title': 'Juego del Gato y Ratón',
            
            // Games menu
            'marks_games': 'Juegos de Mark',
            'cat_and_mouse_game': 'Juego del Gato y Ratón',
            'marks_race': 'Carrera de Mark',
            
            // Loading page
            'loading': 'CARGANDO...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Juego del Gato y Ratón',
            'level': 'Nivel',
            'score': 'Puntuación',
            'lives': 'Vidas',
            'game_over': 'Fin del Juego',
            'you_win': '¡Ganaste!',
            'restart': 'Reiniciar',
            'next_level': 'Siguiente Nivel',
            'pause': 'Pausar',
            'resume': 'Continuar',
            'settings': 'Configuración',
            'sound': 'Sonido',
            'music': 'Música',
            'back_to_menu': 'Volver al Menú',
            
            // Race Game
            'marks_race_title': 'Carrera de Mark',
            'start_race': 'Iniciar Carrera',
            'speed': 'Velocidad',
            'distance': 'Distancia',
            'time': 'Tiempo',
            'fuel': 'Combustible',
            'crash': '¡Choque!',
            'finish_line': '¡Línea de Meta!',
            'best_time': 'Mejor Tiempo',
            'controls': 'Controles',
            'acceleration': 'Aceleración',
            'brake': 'Freno',
            'left': 'Izquierda',
            'right': 'Derecha',
            
            // Metro app
            'metro_title': 'Metro',
            
            // Store app
            'store_title': 'Tienda',
            'coming_soon': 'Próximamente...',
            
            // All Languages Page
            'all_languages_title': 'Todos los Idiomas',
            'language_selector_subtitle': 'Elige tu idioma preferido para los Juegos de Mark',
            'total_languages': 'Idiomas Totales',
            'translated_phrases': 'Frases Traducidas',
            'coverage': 'Cobertura',
            'quick_language_selection': 'Selección Rápida de Idioma',
            'available_languages': 'Idiomas Disponibles',
            'features_title': 'Características',
            'instant_switching': 'Cambio Instantáneo',
            'instant_switching_desc': 'Cambia idiomas al instante sin recargar la página',
            'persistent_settings': 'Configuración Persistente',
            'persistent_settings_desc': 'Tu preferencia de idioma se guarda automáticamente',
            'game_integration': 'Integración de Juegos',
            'game_integration_desc': 'Todos los juegos soportan interfaz multiidioma',
            'global_support': 'Soporte Global',
            'global_support_desc': 'Idiomas RTL y adaptaciones culturales'
        },
        'fr': {
            // Login page
            'password': 'Mot de passe',
            'login': 'Connexion',
            'tryForFree': 'Essai Gratuit',
            'document_title': 'Jeu du Chat et de la Souris',
            
            // Games menu
            'marks_games': 'Jeux de Mark',
            'cat_and_mouse_game': 'Jeu du Chat et de la Souris',
            'marks_race': 'Course de Mark',
            
            // Loading page
            'loading': 'CHARGEMENT...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Jeu du Chat et de la Souris',
            'level': 'Niveau',
            'score': 'Score',
            'lives': 'Vies',
            'game_over': 'Fin du Jeu',
            'you_win': 'Vous avez gagné!',
            'restart': 'Redémarrer',
            'next_level': 'Niveau Suivant',
            'pause': 'Pause',
            'resume': 'Reprendre',
            'settings': 'Paramètres',
            'sound': 'Son',
            'music': 'Musique',
            'back_to_menu': 'Retour au Menu',
            
            // Race Game
            'marks_race_title': 'Course de Mark',
            'start_race': 'Démarrer la Course',
            'speed': 'Vitesse',
            'distance': 'Distance',
            'time': 'Temps',
            'fuel': 'Carburant',
            'crash': 'Accident!',
            'finish_line': 'Ligne d\'Arrivée!',
            'best_time': 'Meilleur Temps',
            'controls': 'Contrôles',
            'acceleration': 'Accélération',
            'brake': 'Frein',
            'left': 'Gauche',
            'right': 'Droite',
            
            // Metro app
            'metro_title': 'Métro',
            
            // Store app
            'store_title': 'Magasin',
            'coming_soon': 'Bientôt disponible...',
            
            // All Languages Page
            'all_languages_title': 'Toutes les Langues',
            'language_selector_subtitle': 'Choisissez votre langue préférée pour les Jeux de Mark',
            'total_languages': 'Langues Totales',
            'translated_phrases': 'Phrases Traduites',
            'coverage': 'Couverture',
            'quick_language_selection': 'Sélection Rapide de Langue',
            'available_languages': 'Langues Disponibles',
            'features_title': 'Fonctionnalités',
            'instant_switching': 'Changement Instantané',
            'instant_switching_desc': 'Changez de langue instantanément sans recharger la page',
            'persistent_settings': 'Paramètres Persistants',
            'persistent_settings_desc': 'Votre préférence de langue est sauvegardée automatiquement',
            'game_integration': 'Intégration des Jeux',
            'game_integration_desc': 'Tous les jeux supportent une interface multilingue',
            'global_support': 'Support Global',
            'global_support_desc': 'Langues RTL et adaptations culturelles'
        },
        'de': {
            // Login page
            'password': 'Passwort',
            'login': 'Anmelden',
            'tryForFree': 'Kostenlos Testen',
            'document_title': 'Katz und Maus Spiel',
            
            // Games menu
            'marks_games': 'Marks Spiele',
            'cat_and_mouse_game': 'Katz und Maus Spiel',
            'marks_race': 'Marks Rennen',
            
            // Loading page
            'loading': 'LADEN...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Katz und Maus Spiel',
            'level': 'Level',
            'score': 'Punkte',
            'lives': 'Leben',
            'game_over': 'Spiel Vorbei',
            'you_win': 'Du hast gewonnen!',
            'restart': 'Neustart',
            'next_level': 'Nächstes Level',
            'pause': 'Pause',
            'resume': 'Fortsetzen',
            'settings': 'Einstellungen',
            'sound': 'Ton',
            'music': 'Musik',
            'back_to_menu': 'Zurück zum Menü',
            
            // Race Game
            'marks_race_title': 'Marks Rennen',
            'start_race': 'Rennen Starten',
            'speed': 'Geschwindigkeit',
            'distance': 'Entfernung',
            'time': 'Zeit',
            'fuel': 'Kraftstoff',
            'crash': 'Unfall!',
            'finish_line': 'Ziellinie!',
            'best_time': 'Beste Zeit',
            'controls': 'Steuerung',
            'acceleration': 'Beschleunigung',
            'brake': 'Bremse',
            'left': 'Links',
            'right': 'Rechts',
            
            // Metro app
            'metro_title': 'U-Bahn',
            
            // Store app
            'store_title': 'Geschäft',
            'coming_soon': 'Demnächst...',
            
            // All Languages Page
            'all_languages_title': 'Alle Sprachen',
            'language_selector_subtitle': 'Wählen Sie Ihre bevorzugte Sprache für Mark\'s Spiele',
            'total_languages': 'Sprachen Insgesamt',
            'translated_phrases': 'Übersetzte Phrasen',
            'coverage': 'Abdeckung',
            'quick_language_selection': 'Schnelle Sprachauswahl',
            'available_languages': 'Verfügbare Sprachen',
            'features_title': 'Funktionen',
            'instant_switching': 'Sofortiger Wechsel',
            'instant_switching_desc': 'Sprachen sofort wechseln ohne Seitenneuladung',
            'persistent_settings': 'Dauerhafte Einstellungen',
            'persistent_settings_desc': 'Ihre Sprachpräferenz wird automatisch gespeichert',
            'game_integration': 'Spiel-Integration',
            'game_integration_desc': 'Alle Spiele unterstützen mehrsprachige Oberfläche',
            'global_support': 'Globaler Support',
            'global_support_desc': 'RTL-Sprachen und kulturelle Anpassungen'
        },
        'it': {
            // Login page
            'password': 'Password',
            'login': 'Accedi',
            'tryForFree': 'Prova Gratuita',
            'document_title': 'Gioco del Gatto e Topo',
            
            // Games menu
            'marks_games': 'Giochi di Mark',
            'cat_and_mouse_game': 'Gioco del Gatto e Topo',
            'marks_race': 'Corsa di Mark',
            
            // Loading page
            'loading': 'CARICAMENTO...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Gioco del Gatto e Topo',
            'level': 'Livello',
            'score': 'Punteggio',
            'lives': 'Vite',
            'game_over': 'Fine Gioco',
            'you_win': 'Hai vinto!',
            'restart': 'Riavvia',
            'next_level': 'Livello Successivo',
            'pause': 'Pausa',
            'resume': 'Riprendi',
            'settings': 'Impostazioni',
            'sound': 'Suono',
            'music': 'Musica',
            'back_to_menu': 'Torna al Menu',
            
            // Race Game
            'marks_race_title': 'Corsa di Mark',
            'start_race': 'Inizia Corsa',
            'speed': 'Velocità',
            'distance': 'Distanza',
            'time': 'Tempo',
            'fuel': 'Carburante',
            'crash': 'Incidente!',
            'finish_line': 'Traguardo!',
            'best_time': 'Miglior Tempo',
            'controls': 'Controlli',
            'acceleration': 'Accelerazione',
            'brake': 'Freno',
            'left': 'Sinistra',
            'right': 'Destra',
            
            // Metro app
            'metro_title': 'Metro',
            
            // Store app
            'store_title': 'Negozio',
            'coming_soon': 'Prossimamente...',
            
            // All Languages Page
            'all_languages_title': 'Tutte le Lingue',
            'language_selector_subtitle': 'Scegli la tua lingua preferita per i Giochi di Mark',
            'total_languages': 'Lingue Totali',
            'translated_phrases': 'Frasi Tradotte',
            'coverage': 'Copertura',
            'quick_language_selection': 'Selezione Rapida Lingua',
            'available_languages': 'Lingue Disponibili',
            'features_title': 'Caratteristiche',
            'instant_switching': 'Cambio Istantaneo',
            'instant_switching_desc': 'Cambia lingua istantaneamente senza ricaricare la pagina',
            'persistent_settings': 'Impostazioni Permanenti',
            'persistent_settings_desc': 'La tua preferenza linguistica viene salvata automaticamente',
            'game_integration': 'Integrazione Giochi',
            'game_integration_desc': 'Tutti i giochi supportano interfaccia multilingue',
            'global_support': 'Supporto Globale',
            'global_support_desc': 'Lingue RTL e adattamenti culturali'
        },
        'pt': {
            // Login page
            'password': 'Senha',
            'login': 'Entrar',
            'tryForFree': 'Teste Grátis',
            'document_title': 'Jogo do Gato e Rato',
            
            // Games menu
            'marks_games': 'Jogos do Mark',
            'cat_and_mouse_game': 'Jogo do Gato e Rato',
            'marks_race': 'Corrida do Mark',
            
            // Loading page
            'loading': 'CARREGANDO...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Jogo do Gato e Rato',
            'level': 'Nível',
            'score': 'Pontuação',
            'lives': 'Vidas',
            'game_over': 'Fim de Jogo',
            'you_win': 'Você ganhou!',
            'restart': 'Reiniciar',
            'next_level': 'Próximo Nível',
            'pause': 'Pausar',
            'resume': 'Continuar',
            'settings': 'Configurações',
            'sound': 'Som',
            'music': 'Música',
            'back_to_menu': 'Voltar ao Menu',
            
            // Race Game
            'marks_race_title': 'Corrida do Mark',
            'start_race': 'Iniciar Corrida',
            'speed': 'Velocidade',
            'distance': 'Distância',
            'time': 'Tempo',
            'fuel': 'Combustível',
            'crash': 'Batida!',
            'finish_line': 'Linha de Chegada!',
            'best_time': 'Melhor Tempo',
            'controls': 'Controles',
            'acceleration': 'Aceleração',
            'brake': 'Freio',
            'left': 'Esquerda',
            'right': 'Direita',
            
            // Metro app
            'metro_title': 'Metrô',
            
            // Store app
            'store_title': 'Loja',
            'coming_soon': 'Em breve...',
            
            // All Languages Page
            'all_languages_title': 'Todos os Idiomas',
            'language_selector_subtitle': 'Escolha seu idioma preferido para os Jogos do Mark',
            'total_languages': 'Total de Idiomas',
            'translated_phrases': 'Frases Traduzidas',
            'coverage': 'Cobertura',
            'quick_language_selection': 'Seleção Rápida de Idioma',
            'available_languages': 'Idiomas Disponíveis',
            'features_title': 'Recursos',
            'instant_switching': 'Troca Instantânea',
            'instant_switching_desc': 'Mude idiomas instantaneamente sem recarregar a página',
            'persistent_settings': 'Configurações Persistentes',
            'persistent_settings_desc': 'Sua preferência de idioma é salva automaticamente',
            'game_integration': 'Integração de Jogos',
            'game_integration_desc': 'Todos os jogos suportam interface multilíngue',
            'global_support': 'Suporte Global',
            'global_support_desc': 'Idiomas RTL e adaptações culturais'
        },
        'ru': {
            // Login page
            'password': 'Пароль',
            'login': 'Войти',
            'tryForFree': 'Попробовать Бесплатно',
            'document_title': 'Игра Кот и Мышь',
            
            // Games menu
            'marks_games': 'Игры Марка',
            'cat_and_mouse_game': 'Игра Кот и Мышь',
            'marks_race': 'Гонка Марка',
            
            // Loading page
            'loading': 'ЗАГРУЗКА...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'Игра Кот и Мышь',
            'level': 'Уровень',
            'score': 'Счёт',
            'lives': 'Жизни',
            'game_over': 'Конец Игры',
            'you_win': 'Вы выиграли!',
            'restart': 'Перезапуск',
            'next_level': 'Следующий Уровень',
            'pause': 'Пауза',
            'resume': 'Продолжить',
            'settings': 'Настройки',
            'sound': 'Звук',
            'music': 'Музыка',
            'back_to_menu': 'В Меню',
            
            // Race Game
            'marks_race_title': 'Гонка Марка',
            'start_race': 'Начать Гонку',
            'speed': 'Скорость',
            'distance': 'Расстояние',
            'time': 'Время',
            'fuel': 'Топливо',
            'crash': 'Авария!',
            'finish_line': 'Финиш!',
            'best_time': 'Лучшее Время',
            'controls': 'Управление',
            'acceleration': 'Ускорение',
            'brake': 'Тормоз',
            'left': 'Влево',
            'right': 'Вправо',
            
            // Metro app
            'metro_title': 'Метро',
            
            // Store app
            'store_title': 'Магазин',
            'coming_soon': 'Скоро...',
            
            // All Languages Page
            'all_languages_title': 'Все Языки',
            'language_selector_subtitle': 'Выберите предпочитаемый язык для Игр Марка',
            'total_languages': 'Всего Языков',
            'translated_phrases': 'Переведенные Фразы',
            'coverage': 'Покрытие',
            'quick_language_selection': 'Быстрый Выбор Языка',
            'available_languages': 'Доступные Языки',
            'features_title': 'Возможности',
            'instant_switching': 'Мгновенное Переключение',
            'instant_switching_desc': 'Переключайте языки мгновенно без перезагрузки страницы',
            'persistent_settings': 'Постоянные Настройки',
            'persistent_settings_desc': 'Ваши языковые предпочтения сохраняются автоматически',
            'game_integration': 'Интеграция Игр',
            'game_integration_desc': 'Все игры поддерживают многоязычный интерфейс',
            'global_support': 'Глобальная Поддержка',
            'global_support_desc': 'RTL языки и культурные адаптации'
        },
        'zh': {
            // Login page
            'password': '密码',
            'login': '登录',
            'tryForFree': '免费试用',
            'document_title': '猫鼠游戏',
            
            // Games menu
            'marks_games': '马克的游戏',
            'cat_and_mouse_game': '猫鼠游戏',
            'marks_race': '马克赛车',
            
            // Loading page
            'loading': '加载中...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': '猫鼠游戏',
            'level': '等级',
            'score': '分数',
            'lives': '生命',
            'game_over': '游戏结束',
            'you_win': '你赢了！',
            'restart': '重新开始',
            'next_level': '下一关',
            'pause': '暂停',
            'resume': '继续',
            'settings': '设置',
            'sound': '声音',
            'music': '音乐',
            'back_to_menu': '返回菜单',
            
            // Race Game
            'marks_race_title': '马克赛车',
            'start_race': '开始比赛',
            'speed': '速度',
            'distance': '距离',
            'time': '时间',
            'fuel': '燃料',
            'crash': '撞车！',
            'finish_line': '终点线！',
            'best_time': '最佳时间',
            'controls': '控制',
            'acceleration': '加速',
            'brake': '刹车',
            'left': '左',
            'right': '右',
            
            // Metro app
            'metro_title': '地铁',
            
            // Store app
            'store_title': '商店',
            'coming_soon': '即将推出...',
            
            // All Languages Page
            'all_languages_title': '所有语言',
            'language_selector_subtitle': '为马克的游戏选择您的首选语言',
            'total_languages': '总语言数',
            'translated_phrases': '翻译短语',
            'coverage': '覆盖率',
            'quick_language_selection': '快速语言选择',
            'available_languages': '可用语言',
            'features_title': '功能',
            'instant_switching': '即时切换',
            'instant_switching_desc': '无需重新加载页面即可即时切换语言',
            'persistent_settings': '持久设置',
            'persistent_settings_desc': '您的语言偏好会自动保存',
            'game_integration': '游戏集成',
            'game_integration_desc': '所有游戏都支持多语言界面',
            'global_support': '全球支持',
            'global_support_desc': 'RTL语言和文化适应'
        },
        'ja': {
            // Login page
            'password': 'パスワード',
            'login': 'ログイン',
            'tryForFree': '無料体験',
            'document_title': 'ネコとネズミのゲーム',
            
            // Games menu
            'marks_games': 'マークのゲーム',
            'cat_and_mouse_game': 'ネコとネズミのゲーム',
            'marks_race': 'マークレース',
            
            // Loading page
            'loading': '読み込み中...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'ネコとネズミのゲーム',
            'level': 'レベル',
            'score': 'スコア',
            'lives': 'ライフ',
            'game_over': 'ゲームオーバー',
            'you_win': '勝利！',
            'restart': '再スタート',
            'next_level': '次のレベル',
            'pause': '一時停止',
            'resume': '再開',
            'settings': '設定',
            'sound': 'サウンド',
            'music': 'ミュージック',
            'back_to_menu': 'メニューに戻る',
            
            // Race Game
            'marks_race_title': 'マークレース',
            'start_race': 'レース開始',
            'speed': 'スピード',
            'distance': '距離',
            'time': '時間',
            'fuel': '燃料',
            'crash': 'クラッシュ！',
            'finish_line': 'ゴールライン！',
            'best_time': 'ベストタイム',
            'controls': 'コントロール',
            'acceleration': 'アクセル',
            'brake': 'ブレーキ',
            'left': '左',
            'right': '右',
            
            // Metro app
            'metro_title': '地下鉄',
            
            // Store app
            'store_title': 'ストア',
            'coming_soon': '近日公開...',
            
            // All Languages Page
            'all_languages_title': 'すべての言語',
            'language_selector_subtitle': 'マークのゲーム用の好みの言語を選択してください',
            'total_languages': '総言語数',
            'translated_phrases': '翻訳されたフレーズ',
            'coverage': 'カバレッジ',
            'quick_language_selection': '迅速な言語選択',
            'available_languages': '利用可能な言語',
            'features_title': '機能',
            'instant_switching': '即座の切り替え',
            'instant_switching_desc': 'ページを再読み込みせずに即座に言語を切り替える',
            'persistent_settings': '永続的設定',
            'persistent_settings_desc': '言語設定は自動的に保存されます',
            'game_integration': 'ゲーム統合',
            'game_integration_desc': 'すべてのゲームが多言語インターフェースをサポート',
            'global_support': 'グローバルサポート',
            'global_support_desc': 'RTL言語と文化的適応'
        },
        'ar': {
            // Login page
            'password': 'كلمة المرور',
            'login': 'تسجيل الدخول',
            'tryForFree': 'جرب مجاناً',
            'document_title': 'لعبة القط والفأر',
            
            // Games menu
            'marks_games': 'ألعاب مارك',
            'cat_and_mouse_game': 'لعبة القط والفأر',
            'marks_race': 'سباق مارك',
            
            // Loading page
            'loading': 'جاري التحميل...',
            
            // Cat and Mouse Game
            'cat_and_mouse_title': 'لعبة القط والفأر',
            'level': 'المستوى',
            'score': 'النقاط',
            'lives': 'الحياة',
            'game_over': 'انتهت اللعبة',
            'you_win': 'لقد فزت!',
            'restart': 'إعادة التشغيل',
            'next_level': 'المستوى التالي',
            'pause': 'إيقاف مؤقت',
            'resume': 'استئناف',
            'settings': 'الإعدادات',
            'sound': 'الصوت',
            'music': 'الموسيقى',
            'back_to_menu': 'العودة للقائمة',
            
            // Race Game
            'marks_race_title': 'سباق مارك',
            'start_race': 'بدء السباق',
            'speed': 'السرعة',
            'distance': 'المسافة',
            'time': 'الوقت',
            'fuel': 'الوقود',
            'crash': 'تصادم!',
            'finish_line': 'خط النهاية!',
            'best_time': 'أفضل وقت',
            'controls': 'التحكم',
            'acceleration': 'التسارع',
            'brake': 'الفرامل',
            'left': 'يسار',
            'right': 'يمين',
            
            // Metro app
            'metro_title': 'مترو',
            
            // Store app
            'store_title': 'متجر',
            'coming_soon': 'قريباً...',
            
            // All Languages Page
            'all_languages_title': 'جميع اللغات',
            'language_selector_subtitle': 'اختر لغتك المفضلة لألعاب مارك',
            'total_languages': 'إجمالي اللغات',
            'translated_phrases': 'العبارات المترجمة',
            'coverage': 'التغطية',
            'quick_language_selection': 'اختيار سريع للغة',
            'available_languages': 'اللغات المتاحة',
            'features_title': 'الميزات',
            'instant_switching': 'التبديل الفوري',
            'instant_switching_desc': 'بدّل اللغات فوراً دون إعادة تحميل الصفحة',
            'persistent_settings': 'الإعدادات الدائمة',
            'persistent_settings_desc': 'يتم حفظ تفضيل اللغة تلقائياً',
            'game_integration': 'تكامل الألعاب',
            'game_integration_desc': 'جميع الألعاب تدعم واجهة متعددة اللغات',
            'global_support': 'الدعم العالمي',
            'global_support_desc': 'لغات RTL والتكيفات الثقافية'
        }
    };
    
    // Public API
    return {
        // Get available languages
        getLanguages: function() {
            return languages;
        },
        
        // Get translation for a key
        translate: function(key, langCode) {
            langCode = langCode || this.getCurrentLanguage();
            return translations[langCode] && translations[langCode][key] 
                ? translations[langCode][key] 
                : translations['en'][key] || key;
        },
        
        // Get current selected language
        getCurrentLanguage: function() {
            return localStorage.getItem('selectedLanguage') || 'en';
        },
        
        // Set language
        setLanguage: function(langCode) {
            if (languages[langCode]) {
                localStorage.setItem('selectedLanguage', langCode);
                return true;
            }
            return false;
        },
        
        // Update all translatable elements on the page
        updatePageTranslations: function(langCode) {
            langCode = langCode || this.getCurrentLanguage();
            
            // Update elements with data-translate attribute
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.translate(key, langCode);
                
                if (element.tagName === 'INPUT' && element.type === 'password') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });
            
            // Update document title if it has data-translate-title
            const titleElement = document.querySelector('[data-translate-title]');
            if (titleElement) {
                const titleKey = titleElement.getAttribute('data-translate-title');
                document.title = this.translate(titleKey, langCode);
            }
            
            // Set text direction for RTL languages
            if (langCode === 'ar') {
                document.body.style.direction = 'rtl';
                document.body.style.textAlign = 'right';
            } else {
                document.body.style.direction = 'ltr';
                document.body.style.textAlign = 'left';
            }
        },
        
        // Create language selector for any page
        createLanguageSelector: function() {
            // Create language selector HTML
            const selectorHTML = `
                <div class="language-selector" style="position: fixed; top: 20px; right: 20px; z-index: 100;">
                    <button class="lang-btn" id="langBtn" style="background: #f8f9fa; border: 2px solid #b8860b; border-radius: 8px; padding: 0.5em 1em; font-size: 0.9em; cursor: pointer; display: flex; align-items: center; gap: 0.5em; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                        <span id="currentLang">${languages[this.getCurrentLanguage()]}</span>
                        <span class="lang-arrow" style="transition: transform 0.3s ease; font-size: 0.8em;">▼</span>
                    </button>
                    <div class="lang-dropdown" id="langDropdown" style="position: absolute; top: 100%; right: 0; background: #fff; border: 2px solid #b8860b; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); margin-top: 5px; min-width: 120px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease;">
                        ${Object.keys(languages).map(lang => `
                            <div class="lang-option${lang === this.getCurrentLanguage() ? ' active' : ''}" data-lang="${lang}" style="padding: 0.6em 1em; cursor: pointer; display: flex; align-items: center; gap: 0.5em; transition: background 0.2s ease; border-bottom: 1px solid #f0f0f0;">
                                ${lang === 'en' ? '🇺🇸 English' : 
                                  lang === 'es' ? '🇪🇸 Español' :
                                  lang === 'fr' ? '🇫🇷 Français' :
                                  lang === 'de' ? '🇩🇪 Deutsch' :
                                  lang === 'it' ? '🇮🇹 Italiano' :
                                  lang === 'pt' ? '🇵🇹 Português' :
                                  lang === 'ru' ? '🇷🇺 Русский' :
                                  lang === 'zh' ? '🇨🇳 中文' :
                                  lang === 'ja' ? '🇯🇵 日本語' :
                                  lang === 'ar' ? '🇸🇦 العربية' : lang}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add CSS if not already present
            if (!document.querySelector('#language-selector-styles')) {
                const style = document.createElement('style');
                style.id = 'language-selector-styles';
                style.textContent = `
                    .lang-btn:hover { background: #e9ecef !important; box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important; }
                    .lang-btn.expanded .lang-arrow { transform: rotate(180deg); }
                    .lang-dropdown.show { opacity: 1; visibility: visible; transform: translateY(0); }
                    .lang-option:last-child { border-bottom: none; }
                    .lang-option:hover { background: #f8f9fa; }
                    .lang-option.active { background: #e8f5e8; font-weight: bold; }
                `;
                document.head.appendChild(style);
            }
            
            return selectorHTML;
        },
        
        // Initialize language selector functionality
        initLanguageSelector: function() {
            const self = this;
            
            setTimeout(() => {
                const langBtn = document.getElementById('langBtn');
                const langDropdown = document.getElementById('langDropdown');
                const currentLang = document.getElementById('currentLang');
                const langOptions = document.querySelectorAll('.lang-option');
                
                if (!langBtn) return;
                
                // Toggle dropdown
                langBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isExpanded = langBtn.classList.contains('expanded');
                    
                    if (isExpanded) {
                        langBtn.classList.remove('expanded');
                        langDropdown.classList.remove('show');
                    } else {
                        langBtn.classList.add('expanded');
                        langDropdown.classList.add('show');
                    }
                });
                
                // Handle language selection
                langOptions.forEach(option => {
                    option.addEventListener('click', function() {
                        const selectedLang = this.getAttribute('data-lang');
                        
                        // Update active state
                        langOptions.forEach(opt => opt.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Update button text
                        currentLang.textContent = languages[selectedLang];
                        
                        // Close dropdown
                        langBtn.classList.remove('expanded');
                        langDropdown.classList.remove('show');
                        
                        // Set language and update translations
                        self.setLanguage(selectedLang);
                        self.updatePageTranslations(selectedLang);
                    });
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (langBtn && !langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                        langBtn.classList.remove('expanded');
                        langDropdown.classList.remove('show');
                    }
                });
            }, 100);
        }
    };
})();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update page translations immediately
    window.TranslationSystem.updatePageTranslations();
});
