/* ============================================================
   AMECA机械 · 国际化 (i18n) 模块
   - 8语言翻译词典（英/俄/阿/西/德/法/简中/繁中）
   - 语言检测、切换、localStorage 持久化
   - RTL 布局自动切换（阿拉伯语）
   - 日期格式适配
   ============================================================ */

(function () {
    'use strict';

    const root = document.documentElement;
    const LANG_KEY = 'ameca-lang';

    /* ============================================================
       支持的语言列表
       ============================================================ */
    const LANGUAGES = [
        { code: 'zh-CN', name: '中文简体', native: '中文简体', dir: 'ltr' },
        { code: 'en',    name: 'English',  native: 'English',    dir: 'ltr' },
        { code: 'ru',    name: 'Русский',  native: 'Русский',    dir: 'ltr' },
        { code: 'ar',    name: 'العربية',  native: 'العربية',    dir: 'rtl' },
        { code: 'es',    name: 'Español',  native: 'Español',    dir: 'ltr' },
        { code: 'de',    name: 'Deutsch',  native: 'Deutsch',    dir: 'ltr' },
        { code: 'fr',    name: 'Français', native: 'Français',   dir: 'ltr' },
        { code: 'zh-TW', name: '中文繁體', native: '中文繁體',    dir: 'ltr' }
    ];

    /* ============================================================
       翻译词典
       ============================================================ */
    const T = {
        /* ---- 导航 ---- */
        'nav.home':     { 'zh-CN':'首页',       'en':'Home',        'ru':'Главная',     'ar':'الرئيسية',   'es':'Inicio',      'de':'Startseite',  'fr':'Accueil',     'zh-TW':'首頁' },
        'nav.products': { 'zh-CN':'产品',       'en':'Products',    'ru':'Продукция',   'ar':'المنتجات',   'es':'Productos',   'de':'Produkte',    'fr':'Produits',    'zh-TW':'產品' },
        'nav.about':    { 'zh-CN':'关于我们',   'en':'About Us',    'ru':'О нас',       'ar':'من نحن',     'es':'Sobre nosotros','de':'Über uns',  'fr':'À propos',    'zh-TW':'關於我們' },
        'nav.login':    { 'zh-CN':'登录',       'en':'Login',       'ru':'Вход',        'ar':'تسجيل الدخول','es':'Iniciar sesión','de':'Anmelden', 'fr':'Connexion',   'zh-TW':'登入' },

        /* ---- 搜索 ---- */
        'search.placeholder': { 'zh-CN':'搜索柴油泵型号 / 配件编号…', 'en':'Search diesel pump model / part number…', 'ru':'Поиск модели дизельного насоса…', 'ar':'ابحث عن موديل مضخة الديزل…', 'es':'Buscar modelo de bomba diésel…', 'de':'Dieselpumpen-Modell suchen…', 'fr':'Rechercher modèle de pompe diesel…', 'zh-TW':'搜尋柴油泵型號 / 零件編號…' },
        'search.btn':    { 'zh-CN':'搜索',      'en':'Search',      'ru':'Поиск',       'ar':'بحث',        'es':'Buscar',      'de':'Suchen',      'fr':'Rechercher',  'zh-TW':'搜尋' },
        'search.hot':    { 'zh-CN':'热门搜索：', 'en':'Hot Search: ', 'ru':'Популярное: ', 'ar':'بحث شائع: ',  'es':'Búsquedas populares: ','de':'Beliebte Suche: ','fr':'Recherches populaires : ','zh-TW':'熱門搜尋：' },
        'search.tag1':   { 'zh-CN':'高压共轨油管','en':'HPCR Fuel Pipe','ru':'Топливная трубка HPCR','ar':'أنبوب وقود HPCR','es':'Tubo de combustible HPCR','de':'HPCR-Kraftstoffleitung','fr':'Conduite carburant HPCR','zh-TW':'高壓共軌油管' },
        'search.tag2':   { 'zh-CN':'柴油泵',     'en':'Diesel Pump', 'ru':'Дизельный насос','ar':'مضخة ديزل', 'es':'Bomba diésel', 'de':'Dieselpumpe',  'fr':'Pompe diesel', 'zh-TW':'柴油泵' },
        'search.tag3':   { 'zh-CN':'喷油器',     'en':'Injector',    'ru':'Форсунка',     'ar':'حاقن',       'es':'Inyector',     'de':'Injektor',    'fr':'Injecteur',   'zh-TW':'噴油器' },

        /* ---- Hero 英雄区 ---- */
        'hero.eyebrow':  { 'zh-CN':'核心动力组件', 'en':'CORE POWER COMPONENT', 'ru':'КЛЮЧЕВОЙ СИЛОВОЙ КОМПОНЕНТ', 'ar':'مكون الطاقة الأساسي', 'es':'COMPONENTE DE POTENCIA CENTRAL', 'de':'KERN-ANTRIEBSKOMPONENTE', 'fr':'COMPOSANT DE PUISSANCE CENTRAL', 'zh-TW':'核心動力組件' },
        'hero.title1':   { 'zh-CN':'AMECA',          'en':'AMECA',          'ru':'AMECA',        'ar':'AMECA',      'es':'AMECA',        'de':'AMECA',        'fr':'AMECA',        'zh-TW':'AMECA' },
        'hero.title2':   { 'zh-CN':'广州亿达机械有限公司', 'en':'Guangzhou Yida Machinery Co., Ltd.', 'ru':'Guangzhou Yida Machinery Co., Ltd.', 'ar':'شركة قوانغتشو ييدا للماكينات المحدودة', 'es':'Guangzhou Yida Machinery Co., Ltd.', 'de':'Guangzhou Yida Machinery Co., Ltd.', 'fr':'Guangzhou Yida Machinery Co., Ltd.', 'zh-TW':'廣州億達機械有限公司' },
        'hero.desc':     { 'zh-CN':'专注挖掘机柴油喷射系统核心零部件研发制造，<br>以精密工艺铸就工程机械的强劲心脏。', 'en':'Specializing in R&D and manufacturing of core components for excavator diesel injection systems,<br>building the powerful heart of construction machinery with precision craftsmanship.', 'ru':'Специализируемся на разработке и производстве ключевых компонентов дизельных систем впрыска для экскаваторов,<br>создавая мощное сердце строительной техники с прецизионным мастерством.', 'ar':'متخصصون في البحث والتطوير وتصنيع المكونات الأساسية لأنظمة حقن الديزل للحفارات،<br>نصنع القلب القوي لآلات البناء بحرفية دقيقة.', 'es':'Especializados en I+D y fabricación de componentes centrales para sistemas de inyección diésel de excavadoras,<br>forjando el potente corazón de la maquinaria de construcción con artesanía de precisión.', 'de':'Spezialisiert auf F&E und Herstellung von Kernkomponenten für Dieseleinspritzsysteme von Baggern,<br>das starke Herz der Baumaschinen mit Präzisionshandwerk.', 'fr':'Spécialisés dans la R&D et la fabrication de composants essentiels pour systèmes d\'injection diesel d\'excavatrices,<br>façonnant le cœur puissant des engins de chantier avec un savoir-faire de précision.', 'zh-TW':'專注挖掘機柴油噴射系統核心零部件研發製造，<br>以精密工藝鑄就工程機械的強勁心臟。' },
        'hero.btn1':     { 'zh-CN':'探索产品',  'en':'Explore Products', 'ru':'Продукция',    'ar':'استكشاف المنتجات','es':'Explorar productos','de':'Produkte entdecken','fr':'Explorer les produits','zh-TW':'探索產品' },
        'hero.btn2':     { 'zh-CN':'了解我们',  'en':'Learn More',     'ru':'Узнать больше', 'ar':'اعرف المزيد',  'es':'Más información','de':'Mehr erfahren', 'fr':'En savoir plus', 'zh-TW':'了解我們' },

        /* ---- 数据统计 ---- */
        'hero.stat1.label': { 'zh-CN':'年行业深耕', 'en':'Years of Expertise', 'ru':'Лет опыта',    'ar':'سنوات من الخبرة','es':'Años de experiencia','de':'Jahre Erfahrung','fr':'Années d\'expertise','zh-TW':'年行業深耕' },
        'hero.stat2.label': { 'zh-CN':'适配机型',   'en':'Compatible Models',  'ru':'Моделей техники','ar':'موديلات متوافقة','es':'Modelos compatibles','de':'Kompatible Modelle','fr':'Modèles compatibles','zh-TW':'適配機型' },
        'hero.stat3.label': { 'zh-CN':'出厂合格率', 'en':'Factory Pass Rate',   'ru':'Проходной контроль','ar':'معدل نجاح المصنع','es':'Tasa de aprobación','de':'Werksdurchlaufquote','fr':'Taux de réussite usine','zh-TW':'出廠合格率' },

        /* ---- 产品区 ---- */
        'products.eyebrow': { 'zh-CN':'产品系列', 'en':'PRODUCTS', 'ru':'ПРОДУКЦИЯ', 'ar':'المنتجات', 'es':'PRODUCTOS', 'de':'PRODUKTE', 'fr':'PRODUITS', 'zh-TW':'產品系列' },
        'products.title':   { 'zh-CN':'核心产品矩阵', 'en':'Core Product Matrix', 'ru':'Основная продуктовая матрица', 'ar':'مصفوفة المنتجات الأساسية', 'es':'Matriz de productos principales', 'de':'Kernproduktmatrix', 'fr':'Matrice des produits clés', 'zh-TW':'核心產品矩陣' },
        'products.sub':     { 'zh-CN':'覆盖主流挖掘机品牌的高精度燃油喷射组件', 'en':'High-precision fuel injection components covering mainstream excavator brands', 'ru':'Высокоточные компоненты топливного впрыска для основных марок экскаваторов', 'ar':'مكونات حقن وقود عالية الدقة تغطي العلامات التجارية الرئيسية للحفارات', 'es':'Componentes de inyección de combustible de alta precisión para las principales marcas de excavadoras', 'de':'Hochpräzise Kraftstoffeinspritzkomponenten für führende Baggermarken', 'fr':'Composants d\'injection de carburant de haute précision couvrant les principales marques d\'excavatrices', 'zh-TW':'覆蓋主流挖掘機品牌的高精度燃油噴射組件' },

        /* ---- 产品卡片 ---- */
        'product1.name': { 'zh-CN':'高压共轨油管', 'en':'HPCR Fuel Rail', 'ru':'Топливная рампа HPCR', 'ar':'قضيب الوقود HPCR', 'es':'Riel de combustible HPCR', 'de':'HPCR-Kraftstoffverteiler', 'fr':'Rampe commune HPCR', 'zh-TW':'高壓共軌油管' },
        'product1.desc': { 'zh-CN':'喷射压力高达 2200bar，精准电控，适配国六排放标准。', 'en':'Injection pressure up to 2200bar, precise electronic control, compliant with Euro VI emission standards.', 'ru':'Давление впрыска до 2200 бар, точное электронное управление, соответствует стандартам Евро-6.', 'ar':'ضغط حقن يصل إلى 2200 بار، تحكم إلكتروني دقيق، متوافق مع معايير الانبعاثات يورو 6.', 'es':'Presión de inyección de hasta 2200 bar, control electrónico preciso, compatible con normas Euro VI.', 'de':'Einspritzdruck bis 2200 bar, präzise elektronische Steuerung, Euro-VI-konform.', 'fr':'Pression d\'injection jusqu\'à 2200 bar, contrôle électronique précis, conforme aux normes Euro VI.', 'zh-TW':'噴射壓力高達 2200bar，精準電控，適配國六排放標準。' },
        'product2.name': { 'zh-CN':'柴油泵', 'en':'Diesel Pump', 'ru':'Дизельный насос', 'ar':'مضخة الديزل', 'es':'Bomba diésel', 'de':'Dieselpumpe', 'fr':'Pompe diesel', 'zh-TW':'柴油泵' },
        'product2.desc': { 'zh-CN':'机械式、电控式，结构可靠，适配大中小型工程机械动力。', 'en':'Mechanical and electronic types, reliable structure, suitable for small to large construction machinery.', 'ru':'Механические и электронные типы, надежная конструкция, подходит для малой и крупной строительной техники.', 'ar':'أنواع ميكانيكية وإلكترونية، هيكل موثوق، مناسب للآلات الصغيرة والكبيرة.', 'es':'Tipos mecánicos y electrónicos, estructura fiable, adecuado para maquinaria pequeña y grande.', 'de':'Mechanische und elektronische Typen, zuverlässige Struktur, für kleine bis große Baumaschinen.', 'fr':'Types mécaniques et électroniques, structure fiable, adapté aux engins de chantier de toutes tailles.', 'zh-TW':'機械式、電控式，結構可靠，適配大中小型工程機械動力。' },
        'product3.name': { 'zh-CN':'机械/电控喷油器', 'en':'Mech/Electronic Injector', 'ru':'Мех./электронная форсунка', 'ar':'حاقن ميكانيكي/إلكتروني', 'es':'Inyector mecánico/electrónico', 'de':'Mech./elektr. Injektor', 'fr':'Injecteur méc./électronique', 'zh-TW':'機械/電控噴油器' },
        'product3.desc': { 'zh-CN':'多段喷射控制，雾化均匀，降低油耗与排放，响应迅捷。', 'en':'Multi-stage injection control, uniform atomization, reducing fuel consumption and emissions with rapid response.', 'ru':'Многоступенчатое управление впрыском, равномерное распыление, снижение расхода топлива и выбросов с быстрым откликом.', 'ar':'تحكم متعدد المراحل في الحقن، ترذيذ موحد، تقليل استهلاك الوقود والانبعاثات مع استجابة سريعة.', 'es':'Control de inyección multietapa, atomización uniforme, reducción del consumo y emisiones con respuesta rápida.', 'de':'Mehrstufige Einspritzsteuerung, gleichmäßige Zerstäubung, reduzierter Verbrauch und Emissionen mit schneller Reaktion.', 'fr':'Contrôle d\'injection multi-étages, atomisation uniforme, réduction de la consommation et des émissions avec réponse rapide.', 'zh-TW':'多段噴射控制，霧化均勻，降低油耗與排放，響應迅捷。' },
        'product4.name': { 'zh-CN':'三偶件', 'en':'Three Precision Parts', 'ru':'Три прецизионные детали', 'ar':'ثلاث قطع دقيقة', 'es':'Tres piezas de precisión', 'de':'Drei Präzisionsteile', 'fr':'Trois pièces de précision', 'zh-TW':'三偶件' },
        'product4.desc': { 'zh-CN':'高精密度，为高压系统提供可靠供油保障。', 'en':'High precision, providing reliable fuel supply for high-pressure systems.', 'ru':'Высокая точность, обеспечивает надежную подачу топлива для систем высокого давления.', 'ar':'دقة عالية، توفر إمدادًا موثوقًا بالوقود لأنظمة الضغط العالي.', 'es':'Alta precisión, suministro fiable de combustible para sistemas de alta presión.', 'de':'Hohe Präzision, zuverlässige Kraftstoffversorgung für Hochdrucksysteme.', 'fr':'Haute précision, alimentation fiable en carburant pour systèmes haute pression.', 'zh-TW':'高精密度，為高壓系統提供可靠供油保障。' },
        'product.tag.hpcr': { 'zh-CN':'HPCR', 'en':'HPCR', 'ru':'HPCR', 'ar':'HPCR', 'es':'HPCR', 'de':'HPCR', 'fr':'HPCR', 'zh-TW':'HPCR' },
        'product.tag.ve':   { 'zh-CN':'VE',   'en':'VE',   'ru':'VE',   'ar':'VE',   'es':'VE',   'de':'VE',   'fr':'VE',   'zh-TW':'VE' },
        'product.tag.gdi':  { 'zh-CN':'GDI',  'en':'GDI',  'ru':'GDI',  'ar':'GDI',  'es':'GDI',  'de':'GDI',  'fr':'GDI',  'zh-TW':'GDI' },
        'product.tag.fp':   { 'zh-CN':'FP',   'en':'FP',   'ru':'FP',   'ar':'FP',   'es':'FP',   'de':'FP',   'fr':'FP',   'zh-TW':'FP' },

        /* ---- 关于我们 ---- */
        'about.eyebrow': { 'zh-CN':'关于我们', 'en':'ABOUT US', 'ru':'О НАС', 'ar':'من نحن', 'es':'SOBRE NOSOTROS', 'de':'ÜBER UNS', 'fr':'À PROPOS', 'zh-TW':'關於我們' },
        'about.title':   { 'zh-CN':'精工铸芯，十年如一日', 'en':'Precision Forged, Decade of Dedication', 'ru':'Точность, кованая десятилетием', 'ar':'دقة مصقولة، عقد من التفاني', 'es':'Precisión forjada, una década de dedicación', 'de':'Präzision geschmiedet, ein Jahrzehnt Hingabe', 'fr':'Précision forgée, une décennie de dévouement', 'zh-TW':'精工鑄芯，十年如一日' },
        'about.lead':    { 'zh-CN':'AMECA创立于 2005 年，专注于工程机械柴油喷射系统的研发与制造。我们深谙每一颗螺钉的扭矩、每一道油路的精度，都是挖掘机澎湃动力的基石。', 'en':'Founded in 2005, AMECA specializes in R&D and manufacturing of diesel injection systems for construction machinery. We understand that every bolt torque and every fuel passage precision is the foundation of an excavator\'s surging power.', 'ru':'Основанная в 2005 году, AMECA специализируется на разработке и производстве дизельных систем впрыска для строительной техники. Мы понимаем, что каждый момент затяжки болта и каждая точность топливного канала — это основа мощной работы экскаватора.', 'ar':'تأسست AMECA في عام 2005، وتتخصص في البحث والتطوير وتصنيع أنظمة حقن الديزل لآلات البناء. نحن ندرك أن كل عزم دوران للمسمار وكل دقة في مسار الوقود هي أساس القوة الهائلة للحفارة.', 'es':'Fundada en 2005, AMECA se especializa en I+D y fabricación de sistemas de inyección diésel para maquinaria de construcción. Sabemos que cada par de apriete y cada precisión en el paso de combustible es la base de la potencia de una excavadora.', 'de':'2005 gegründet, ist AMECA auf F&E und Herstellung von Dieseleinspritzsystemen für Baumaschinen spezialisiert. Wir wissen, dass jedes Drehmoment und jede Präzision der Kraftstoffführung die Grundlage für die Kraft eines Baggers ist.', 'fr':'Fondée en 2005, AMECA est spécialisée dans la R&D et la fabrication de systèmes d\'injection diesel pour engins de chantier. Nous savons que chaque couple de serrage et chaque précision de passage de carburant est le fondement de la puissance d\'une excavatrice.', 'zh-TW':'AMECA創立於 2005 年，專注於工程機械柴油噴射系統的研發與製造。我們深諳每一顆螺釘的扭矩、每一道油路的精度，都是挖掘機澎湃動力的基石。' },
        'about.list1':   { 'zh-CN':'自有精密加工中心，关键工序自主可控', 'en':'In-house precision machining center, full control of key processes', 'ru':'Собственный центр прецизионной обработки, полный контроль ключевых процессов', 'ar':'مركز تصنيع دقيق داخلي، تحكم كامل في العمليات الرئيسية', 'es':'Centro de mecanizado de precisión propio, control total de procesos clave', 'de':'Eigenes Präzisionsbearbeitungszentrum, volle Kontrolle über Schlüsselprozesse', 'fr':'Centre d\'usinage de précision interne, contrôle total des processus clés', 'zh-TW':'自有精密加工中心，關鍵工序自主可控' },
        'about.list2':   { 'zh-CN':'与主机厂同步开发，全生命周期适配', 'en':'Synchronized development with OEMs, full lifecycle compatibility', 'ru':'Синхронная разработка с производителями, полная совместимость жизненного цикла', 'ar':'تطوير متزامن مع المصنعين الأصليين، توافق كامل لدورة الحياة', 'es':'Desarrollo sincronizado con fabricantes, compatibilidad durante todo el ciclo de vida', 'de':'Synchronisierte Entwicklung mit OEMs, vollständige Lebenszyklus-Kompatibilität', 'fr':'Développement synchronisé avec les constructeurs, compatibilité sur tout le cycle de vie', 'zh-TW':'與主機廠同步開發，全生命週期適配' },
        'about.list3':   { 'zh-CN':'通过 ISO 9001 与 IATF 16949 双认证', 'en':'Dual certified ISO 9001 and IATF 16949', 'ru':'Двойная сертификация ISO 9001 и IATF 16949', 'ar':'حاصل على شهادتي ISO 9001 و IATF 16949', 'es':'Doble certificación ISO 9001 e IATF 16949', 'de':'Doppelt zertifiziert nach ISO 9001 und IATF 16949', 'fr':'Double certification ISO 9001 et IATF 16949', 'zh-TW':'通過 ISO 9001 與 IATF 16949 雙認證' },
        'about.btn':     { 'zh-CN':'查看企业资质', 'en':'View Certifications', 'ru':'Сертификаты', 'ar':'عرض الشهادات', 'es':'Ver certificaciones', 'de':'Zertifizierungen ansehen', 'fr':'Voir les certifications', 'zh-TW':'查看企業資質' },

        /* ---- 页脚 ---- */
        'footer.tagline':    { 'zh-CN':'工程机械核心动力零部件专家', 'en':'Core Power Component Expert for Construction Machinery', 'ru':'Эксперт по ключевым силовым компонентам для строительной техники', 'ar':'خبير مكونات الطاقة الأساسية لآلات البناء', 'es':'Experto en componentes de potencia para maquinaria de construcción', 'de':'Experte für Kernantriebskomponenten von Baumaschinen', 'fr':'Expert en composants de puissance pour engins de chantier', 'zh-TW':'工程機械核心動力零部件專家' },
        'footer.col1.title': { 'zh-CN':'产品',     'en':'Products', 'ru':'Продукция', 'ar':'المنتجات', 'es':'Productos', 'de':'Produkte', 'fr':'Produits', 'zh-TW':'產品' },
        'footer.col1.item1': { 'zh-CN':'高压共轨油管','en':'HPCR Fuel Rail','ru':'Топливная рампа HPCR','ar':'قضيب الوقود HPCR','es':'Riel combustible HPCR','de':'HPCR-Kraftstoffverteiler','fr':'Rampe commune HPCR','zh-TW':'高壓共軌油管' },
        'footer.col1.item2': { 'zh-CN':'柴油泵',    'en':'Diesel Pump',  'ru':'Дизельный насос', 'ar':'مضخة ديزل', 'es':'Bomba diésel', 'de':'Dieselpumpe', 'fr':'Pompe diesel', 'zh-TW':'柴油泵' },
        'footer.col1.item3': { 'zh-CN':'机械/电控喷油器','en':'Mech/Electronic Injector','ru':'Мех./эл. форсунка','ar':'حاقن ميكانيكي/إلكتروني','es':'Inyector mec./electr.','de':'Mech./elektr. Injektor','fr':'Injecteur méc./électr.','zh-TW':'機械/電控噴油器' },
        'footer.col1.item4': { 'zh-CN':'三偶件',    'en':'Precision Parts','ru':'Прецизионные детали','ar':'قطع دقيقة','es':'Piezas de precisión','de':'Präzisionsteile','fr':'Pièces de précision','zh-TW':'三偶件' },
        'footer.col2.title': { 'zh-CN':'公司',     'en':'Company',  'ru':'Компания', 'ar':'الشركة', 'es':'Empresa', 'de':'Unternehmen', 'fr':'Entreprise', 'zh-TW':'公司' },
        'footer.col2.item1': { 'zh-CN':'关于我们',  'en':'About Us', 'ru':'О нас', 'ar':'من نحن', 'es':'Sobre nosotros', 'de':'Über uns', 'fr':'À propos', 'zh-TW':'關於我們' },
        'footer.col2.item2': { 'zh-CN':'研发实力',  'en':'R&D Strength','ru':'Возможности НИОКР','ar':'قوة البحث والتطوير','es':'Capacidad de I+D','de':'F&E-Stärke','fr':'Force R&D','zh-TW':'研發實力' },
        'footer.col2.item3': { 'zh-CN':'新闻动态',  'en':'News',      'ru':'Новости', 'ar':'الأخبار', 'es':'Noticias', 'de':'Neuigkeiten', 'fr':'Actualités', 'zh-TW':'新聞動態' },
        'footer.col2.item4': { 'zh-CN':'加入我们',  'en':'Join Us',   'ru':'Вакансии', 'ar':'انضم إلينا', 'es':'Únete', 'de':'Karriere', 'fr':'Nous rejoindre', 'zh-TW':'加入我們' },
        'footer.col3.title': { 'zh-CN':'支持',     'en':'Support',  'ru':'Поддержка','ar':'الدعم', 'es':'Soporte', 'de':'Support', 'fr':'Support', 'zh-TW':'支援' },
        'footer.col3.item1': { 'zh-CN':'技术文档',  'en':'Technical Docs','ru':'Тех. документация','ar':'المستندات التقنية','es':'Documentación técnica','de':'Technische Dokumente','fr':'Documentation technique','zh-TW':'技術文件' },
        'footer.col3.item2': { 'zh-CN':'售后网点',  'en':'Service Centers','ru':'Сервисные центры','ar':'مراكز الخدمة','es':'Centros de servicio','de':'Servicezentren','fr':'Centres de service','zh-TW':'售後網點' },
        'footer.col3.item3': { 'zh-CN':'在线咨询',  'en':'Online Inquiry','ru':'Онлайн-запрос','ar':'استفسار عبر الإنترنت','es':'Consulta en línea','de':'Online-Anfrage','fr':'Demande en ligne','zh-TW':'線上諮詢' },
        'footer.col3.item4': { 'zh-CN':'登录系统',  'en':'System Login','ru':'Вход в систему','ar':'تسجيل الدخول','es':'Inicio de sesión','de':'System-Login','fr':'Connexion système','zh-TW':'登入系統' },
        'footer.col4.title': { 'zh-CN':'联系',     'en':'Contact',  'ru':'Контакты','ar':'اتصل بنا','es':'Contacto','de':'Kontakt','fr':'Contact','zh-TW':'聯繫' },
        'footer.col4.item1': { 'zh-CN':'amecadiesel88@gmail.com', 'en':'amecadiesel88@gmail.com', 'ru':'amecadiesel88@gmail.com', 'ar':'amecadiesel88@gmail.com', 'es':'amecadiesel88@gmail.com', 'de':'amecadiesel88@gmail.com', 'fr':'amecadiesel88@gmail.com', 'zh-TW':'amecadiesel88@gmail.com' },
        'footer.col4.item2': { 'zh-CN':'+86 16620058648', 'en':'+86 16620058648', 'ru':'+86 16620058648', 'ar':'+86 16620058648', 'es':'+86 16620058648', 'de':'+86 16620058648', 'fr':'+86 16620058648', 'zh-TW':'+86 16620058648' },
        'footer.col4.item3': { 'zh-CN':'中国 · 广州亿达机械有限公司', 'en':'Guangzhou Yida Machinery Co., Ltd., China', 'ru':'Guangzhou Yida Machinery Co., Ltd., Китай', 'ar':'شركة قوانغتشو ييدا للماكينات المحدودة، الصين', 'es':'Guangzhou Yida Machinery Co., Ltd., China', 'de':'Guangzhou Yida Machinery Co., Ltd., China', 'fr':'Guangzhou Yida Machinery Co., Ltd., Chine', 'zh-TW':'中國 · 廣州億達機械有限公司' },
        'footer.copyright':  { 'zh-CN':'© 2026 AMECA MACHINERY. 保留所有权利。', 'en':'© 2026 AMECA MACHINERY. All rights reserved.', 'ru':'© 2026 AMECA MACHINERY. Все права защищены.', 'ar':'© 2026 AMECA MACHINERY. جميع الحقوق محفوظة.', 'es':'© 2026 AMECA MACHINERY. Todos los derechos reservados.', 'de':'© 2026 AMECA MACHINERY. Alle Rechte vorbehalten.', 'fr':'© 2026 AMECA MACHINERY. Tous droits réservés.', 'zh-TW':'© 2026 AMECA MACHINERY. 保留所有權利。' },
        'footer.privacy':    { 'zh-CN':'隐私政策', 'en':'Privacy Policy', 'ru':'Конфиденциальность','ar':'سياسة الخصوصية','es':'Política de privacidad','de':'Datenschutz','fr':'Confidentialité','zh-TW':'隱私政策' },
        'footer.terms':      { 'zh-CN':'服务条款', 'en':'Terms of Service','ru':'Условия использования','ar':'شروط الخدمة','es':'Términos de servicio','de':'Nutzungsbedingungen','fr':'Conditions d\'utilisation','zh-TW':'服務條款' },
        'footer.sitemap':    { 'zh-CN':'网站地图', 'en':'Sitemap', 'ru':'Карта сайта','ar':'خريطة الموقع','es':'Mapa del sitio','de':'Sitemap','fr':'Plan du site','zh-TW':'網站地圖' },

        /* ---- 辅助标签 / ARIA ---- */
        'aria.menu.open':  { 'zh-CN':'打开菜单','en':'Open menu','ru':'Открыть меню','ar':'فتح القائمة','es':'Abrir menú','de':'Menü öffnen','fr':'Ouvrir le menu','zh-TW':'打開選單' },
        'aria.menu.close': { 'zh-CN':'关闭菜单','en':'Close menu','ru':'Закрыть меню','ar':'إغلاق القائمة','es':'Cerrar menú','de':'Menü schließen','fr':'Fermer le menu','zh-TW':'關閉選單' },
        'aria.backToTop':  { 'zh-CN':'回到顶部','en':'Back to top','ru':'Наверх','ar':'العودة للأعلى','es':'Volver arriba','de':'Nach oben','fr':'Retour en haut','zh-TW':'回到頂部' },
        'aria.themeToggle':{ 'zh-CN':'切换主题','en':'Toggle theme','ru':'Сменить тему','ar':'تبديل السمة','es':'Cambiar tema','de':'Design wechseln','fr':'Changer le thème','zh-TW':'切換主題' },
        'aria.langSelect': { 'zh-CN':'选择语言','en':'Select language','ru':'Выбрать язык','ar':'اختر اللغة','es':'Seleccionar idioma','de':'Sprache wählen','fr':'Choisir la langue','zh-TW':'選擇語言' },
        'meta.description':{ 'zh-CN':'专业挖掘机柴油泵研发制造，高品质工程机械核心零部件供应商','en':'Professional excavator diesel pump R&D and manufacturing, high-quality construction machinery core component supplier','ru':'Профессиональная разработка и производство дизельных насосов для экскаваторов, поставщик высококачественных компонентов','ar':'بحث وتطوير وتصنيع مضخات الديزل للحفارات، مورد مكونات أساسية عالية الجودة لآلات البناء','es':'Fabricación profesional de bombas diésel para excavadoras, proveedor de componentes de alta calidad','de':'Professionelle Entwicklung und Herstellung von Bagger-Dieselpumpen, Lieferant hochwertiger Kernkomponenten','fr':'Fabrication professionnelle de pompes diesel pour excavatrices, fournisseur de composants de haute qualité','zh-TW':'專業挖掘機柴油泵研發製造，高品質工程機械核心零部件供應商' },

        /* ---- 视觉标签 ---- */
        'visual.label': { 'zh-CN':'精密 · 动力 · 持久', 'en':'PRECISION · POWER · PERSISTENCE', 'ru':'ТОЧНОСТЬ · МОЩНОСТЬ · НАДЕЖНОСТЬ', 'ar':'الدقة · القوة · الاستمرارية', 'es':'PRECISIÓN · POTENCIA · PERSISTENCIA', 'de':'PRÄZISION · KRAFT · BESTÄNDIGKEIT', 'fr':'PRÉCISION · PUISSANCE · PERSISTANCE', 'zh-TW':'精密 · 動力 · 持久' },

        /* ---- 品牌副标题 ---- */
        'brand.sub': { 'zh-CN':'广州亿达机械有限公司', 'en':'Guangzhou Yida Machinery', 'ru':'Guangzhou Yida Machinery', 'ar':'قوانغتشو ييدا للماكينات', 'es':'Guangzhou Yida Machinery', 'de':'Guangzhou Yida Machinery', 'fr':'Guangzhou Yida Machinery', 'zh-TW':'廣州億達機械有限公司' }
    };

    /* ============================================================
       日期格式化（按语言适配）
       ============================================================ */
    const DATE_FORMATS = {
        'zh-CN': { locale: 'zh-CN', options: { year:'numeric', month:'long', day:'numeric' } },
        'en':    { locale: 'en-US', options: { year:'numeric', month:'long', day:'numeric' } },
        'ru':    { locale: 'ru-RU', options: { year:'numeric', month:'long', day:'numeric' } },
        'ar':    { locale: 'ar-SA', options: { year:'numeric', month:'long', day:'numeric' } },
        'es':    { locale: 'es-ES', options: { year:'numeric', month:'long', day:'numeric' } },
        'de':    { locale: 'de-DE', options: { year:'numeric', month:'long', day:'numeric' } },
        'fr':    { locale: 'fr-FR', options: { year:'numeric', month:'long', day:'numeric' } },
        'zh-TW': { locale: 'zh-TW', options: { year:'numeric', month:'long', day:'numeric' } }
    };

    /* ---- 暴露到全局对象 ---- */
    window.AMECA_i18n = {
        LANGUAGES,
        T,
        DATE_FORMATS,
        LANG_KEY,

        /** 获取当前语言 */
        getLang() {
            let lang = null;
            try { lang = localStorage.getItem(LANG_KEY); } catch (e) {}
            if (lang && LANGUAGES.some(l => l.code === lang)) return lang;
            // 浏览器偏好优先匹配
            const browserLang = (navigator.language || 'en').split('-')[0];
            const match = LANGUAGES.find(l => l.code.startsWith(browserLang));
            return match ? match.code : 'zh-CN';
        },

        /** 设置语言 */
        setLang(code) {
            try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
        },

        /** 获取翻译文本 */
        t(key, lang) {
            const entry = T[key];
            if (!entry) { console.warn('[i18n] Missing key:', key); return key; }
            return entry[lang] || entry['en'] || entry['zh-CN'] || key;
        },

        /** 获取当前语言方向 */
        getDir(lang) {
            const langDef = LANGUAGES.find(l => l.code === lang);
            return langDef ? langDef.dir : 'ltr';
        },

        /** 格式化日期 */
        formatDate(date, lang) {
            const fmt = DATE_FORMATS[lang] || DATE_FORMATS['en'];
            try {
                return date.toLocaleDateString(fmt.locale, fmt.options);
            } catch (e) {
                return date.toLocaleDateString();
            }
        },

        /** 应用 RTL 布局 */
        applyRTL(dir) {
            root.setAttribute('dir', dir);
            root.style.direction = dir;
            if (dir === 'rtl') {
                root.classList.add('rtl');
            } else {
                root.classList.remove('rtl');
            }
        },

        /** 应用语言 */
        apply(lang) {
            // 1. 设置 html lang 属性
            root.setAttribute('lang', lang);

            // 2. 应用 RTL
            const dir = this.getDir(lang);
            this.applyRTL(dir);

            // 3. 翻译所有文本节点（data-i18n）
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = this.t(key, lang);
                // 只替换直接文本节点（不破坏子元素如 <br>）
                if (text.includes('<br>')) {
                    // 包含 <br>——安全地替换 innerHTML
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            });

            // 4. 翻译 placeholder（data-i18n-placeholder）
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                el.placeholder = this.t(key, lang);
            });

            // 5. 翻译 aria-label（data-i18n-aria）
            document.querySelectorAll('[data-i18n-aria]').forEach(el => {
                const key = el.getAttribute('data-i18n-aria');
                el.setAttribute('aria-label', this.t(key, lang));
            });

            // 6. 更新 meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', this.t('meta.description', lang));
            }

            // 7. 更新当前时间（如果页面有显示）
            const nowEl = document.querySelector('[data-i18n-date]');
            if (nowEl) {
                nowEl.textContent = this.formatDate(new Date(), lang);
            }

            // 8. 触发自定义事件（其他脚本可监听）
            root.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang, dir } }));

            console.log('[i18n] Language applied:', lang, '| dir:', dir);
        }
    };

    /* ============================================================
       创建语言选择器 HTML
       ============================================================ */
    function buildLangSwitcher() {
        const currentLang = window.AMECA_i18n.getLang();
        const currentLangDef = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

        const container = document.createElement('div');
        container.className = 'lang-switcher';
        container.setAttribute('data-i18n-aria', 'aria.langSelect');
        container.setAttribute('aria-label', window.AMECA_i18n.t('aria.langSelect', currentLang));

        // 当前选中显示
        const trigger = document.createElement('button');
        trigger.className = 'lang-switcher-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" stroke-width="2"/>
                <path d="M2 12 H22 M12 2 V22" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span class="lang-switcher-current">${currentLangDef.native}</span>
            <svg class="lang-switcher-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9 L12 15 L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // 下拉选项
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-switcher-dropdown';
        dropdown.setAttribute('role', 'listbox');

        LANGUAGES.forEach((langDef, idx) => {
            const option = document.createElement('button');
            option.className = 'lang-option' + (langDef.code === currentLang ? ' active' : '');
            option.type = 'button';
            option.setAttribute('role', 'option');
            option.setAttribute('data-lang', langDef.code);
            option.setAttribute('aria-selected', langDef.code === currentLang ? 'true' : 'false');
            option.textContent = langDef.native;
            option.addEventListener('click', () => {
                switchLang(langDef.code);
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
            dropdown.appendChild(option);
        });

        // 点击触发
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // 点击外部关闭
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        });

        container.appendChild(trigger);
        container.appendChild(dropdown);

        return container;
    }

    /** 切换语言 */
    function switchLang(code) {
        window.AMECA_i18n.setLang(code);
        window.AMECA_i18n.apply(code);
        updateSwitcherDisplay(code);
    }

    /** 更新切换器显示 */
    function updateSwitcherDisplay(code) {
        const langDef = LANGUAGES.find(l => l.code === code);
        if (!langDef) return;
        const currentSpan = document.querySelector('.lang-switcher-current');
        if (currentSpan) currentSpan.textContent = langDef.native;
        document.querySelectorAll('.lang-option').forEach(opt => {
            const isActive = opt.getAttribute('data-lang') === code;
            opt.classList.toggle('active', isActive);
            opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        const container = document.querySelector('.lang-switcher');
        if (container) {
            container.setAttribute('aria-label', window.AMECA_i18n.t('aria.langSelect', code));
        }
    }

    /* ============================================================
       初始化
       ============================================================ */
    function init() {
        // 1. 注入语言切换器到 header
        const header = document.getElementById('siteHeader');
        if (header) {
            const switcher = buildLangSwitcher();
            header.appendChild(switcher);
        }

        // 2. 应用保存的语言设置
        const savedLang = window.AMECA_i18n.getLang();
        window.AMECA_i18n.apply(savedLang);

        console.log('%c[AMECA i18n] Ready · 8 Languages · RTL Support', 'color:#2e2bf5;font-weight:bold;');
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
