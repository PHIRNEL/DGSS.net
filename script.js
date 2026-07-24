document.addEventListener("DOMContentLoaded", () => {

    /*
    =====================================
    MES VARIABLES PRINCIPALES
    =====================================
    Je récupère tous les éléments HTML dont j'ai besoin 
    pour manipuler l'affichage, le menu et le contenu de la DGSS.
    */

    const discoverButton = document.getElementById("decouvrirDGSS");
    const siteContent = document.getElementById("contenu-dgss");
    const footer = document.querySelector(".site-footer");

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");


    /*
    =====================================
    AFFICHER LE CONTENU DE LA DGSS AU CLIC
    =====================================
    Quand je clique sur le bouton "Découvrir", je rends le contenu 
    et le footer visibles, je bloque le bouton et je fais un scroll fluide vers l'accueil.
    */

    if (discoverButton && siteContent) {

        discoverButton.addEventListener("click", () => {

            siteContent.classList.add("visible");

            if (footer) {
                footer.classList.add("visible");
            }

            discoverButton.textContent = "DGSS découverte";
            discoverButton.disabled = true;

            setTimeout(() => {

                const accueil = document.getElementById("accueil");
                const navbar = document.querySelector(".navbar");

                if (accueil) {

                    const navbarHeight = navbar
                        ? navbar.offsetHeight
                        : 0;

                    const position =
                        accueil.getBoundingClientRect().top +
                        window.scrollY -
                        navbarHeight;

                    window.scrollTo({
                        top: position,
                        behavior: "smooth"
                    });

                }

            }, 250);

        });

    }


    /*
    =====================================
    MON MENU MOBILE (RESPONSIVE)
    =====================================
    Je gère l'ouverture/fermeture du menu sur téléphone quand on clique sur le burger, 
    quand on clique sur un lien du menu, ou quand on clique en dehors.
    */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            navLinks.classList.toggle("active");

            const isOpen =
                navLinks.classList.contains("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        document.addEventListener("click", (event) => {

            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /*
    =====================================
    MON SLIDER DGSS
    =====================================
    Je configure tout le comportement de mon carrousel : 
    changement auto, boutons suivant/précédent, indicateurs et pause au survol.
    */

    const slider = document.querySelector(".dgss-slider");

    if (slider) {

        const slides = slider.querySelectorAll(".slide");

        const prevButton =
            slider.querySelector(".prev");

        const nextButton =
            slider.querySelector(".next");

        const indicatorsContainer =
            slider.querySelector(".dgss-indicators");

        const progressBar =
            slider.querySelector(".slider-progress");

        let currentSlide = 0;

        let autoPlay = null;

        const slideDuration = 10000;


        /*
        -------------------------------------
        VÉRIFICATION DES SLIDES
        -------------------------------------
        Je vérifie si mon slider contient bien des slides avant de continuer.
        */

        if (slides.length === 0) {

            console.warn(
                "Aucune slide trouvée dans .dgss-slider"
            );

        } else {


            /*
            -------------------------------------
            CRÉATION DES INDICATEURS (POINTS)
            -------------------------------------
            Je génère dynamiquement un petit indicateur pour chaque slide 
            et je leur ajoute la gestion du clic et du clavier (accessibilité).
            */

            if (indicatorsContainer) {

                slides.forEach((slide, index) => {

                    const indicator =
                        document.createElement("span");

                    indicator.setAttribute(
                        "role",
                        "button"
                    );

                    indicator.setAttribute(
                        "tabindex",
                        "0"
                    );

                    indicator.setAttribute(
                        "aria-label",
                        `Afficher la diapositive ${index + 1}`
                    );

                    indicator.addEventListener(
                        "click",
                        () => {

                            showSlide(index);

                            restartAutoPlay();

                        }
                    );


                    indicator.addEventListener(
                        "keydown",
                        event => {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();

                                showSlide(index);

                                restartAutoPlay();

                            }

                        }
                    );


                    indicatorsContainer.appendChild(
                        indicator
                    );

                });

            }


            const indicators =
                indicatorsContainer
                    ? indicatorsContainer.querySelectorAll("span")
                    : [];


            /*
            -------------------------------------
            FONCTION POUR AFFICHER UNE SLIDE PRÉCISE
            -------------------------------------
            Je gère le passage d'une diapositive à une autre en boucle 
            et j'active le point indicateur correspondant.
            */

            function showSlide(index) {

                if (index >= slides.length) {

                    currentSlide = 0;

                } else if (index < 0) {

                    currentSlide =
                        slides.length - 1;

                } else {

                    currentSlide = index;

                }


                slides.forEach((slide, i) => {

                    slide.classList.toggle(
                        "active",
                        i === currentSlide
                    );

                });


                indicators.forEach(
                    (indicator, i) => {

                        indicator.classList.toggle(
                            "active",
                            i === currentSlide
                        );

                    }
                );


                animateProgress();

            }


            /*
            -------------------------------------
            NAVIGATION SLIDE SUIVANTE / PRÉCÉDENTE
            -------------------------------------
            */

            function nextSlide() {

                showSlide(
                    currentSlide + 1
                );

            }

            function previousSlide() {

                showSlide(
                    currentSlide - 1
                );

            }


            /*
            -------------------------------------
            ÉCOUTEURS SUR LES BOUTONS DU SLIDER
            -------------------------------------
            */

            if (nextButton) {

                nextButton.addEventListener(
                    "click",
                    () => {

                        nextSlide();

                        restartAutoPlay();

                    }
                );

            }

            if (prevButton) {

                prevButton.addEventListener(
                    "click",
                    () => {

                        previousSlide();

                        restartAutoPlay();

                    }
                );

            }


            /*
            -------------------------------------
            GESTION DE LA LECTURE AUTOMATIQUE
            -------------------------------------
            */

            function startAutoPlay() {

                stopAutoPlay();

                autoPlay = setInterval(
                    nextSlide,
                    slideDuration
                );

            }


            function stopAutoPlay() {

                if (autoPlay) {

                    clearInterval(autoPlay);

                    autoPlay = null;

                }

            }


            function restartAutoPlay() {

                stopAutoPlay();

                startAutoPlay();

            }


            /*
            -------------------------------------
            ANIMATION DE LA BARRE DE PROGRESSION
            -------------------------------------
            Je relance l'animation de la barre de chargement à chaque changement de slide.
            */

            function animateProgress() {

                if (!progressBar) {
                    return;
                }

                progressBar.style.transition =
                    "none";

                progressBar.style.width =
                    "0%";


                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        progressBar.style.transition =
                            `width ${slideDuration}ms linear`;

                        progressBar.style.width =
                            "100%";

                    });

                });

            }


            /*
            -------------------------------------
            PAUSE AU SURVOL ET NAVIGATION CLAVIER
            -------------------------------------
            */

            slider.addEventListener(
                "mouseenter",
                stopAutoPlay
            );


            slider.addEventListener(
                "mouseleave",
                startAutoPlay
            );


            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "ArrowRight"
                    ) {

                        nextSlide();

                        restartAutoPlay();

                    }


                    if (
                        event.key === "ArrowLeft"
                    ) {

                        previousSlide();

                        restartAutoPlay();

                    }

                }
            );


            /*
            -------------------------------------
            LANCEMENT INITIAL DU SLIDER
            -------------------------------------
            */

            showSlide(0);

            startAutoPlay();

        }

    }


    /*
    =====================================
    GESTION DE MA LISTE DE DOCUMENTS & RECHERCHE
    =====================================
    Je définis ma base de données de documents, et je gère 
    le filtre de recherche instantanée avec le surlignage des mots trouvés.
    */

    const documents = [

        {
            titre: "Socle juridique",

            categorie:
                "Socle juridique applicable aux OPS",

            lien:
                "Documents/Socle-Juridique-applicable-aux-OPS.pdf"

        },


        {
            titre: "Arrêté n° 9288",

            categorie:
                "Attributions et organisation de la DGSS",

            lien:
                "Documents/Arreté9288.pdf"

        },


        {
            titre: "Arrêté n° 6438 MTSS-CAB",

            categorie:
                "Nomination des membres de la commission technique",

            lien:
                "Documents/ArreteNo6438MTSS-CAB.PDF"

        },


        {
            titre: "Arrêté n° 14428 MTSS-CAB",

            categorie:
                "Attributions et organisation des directions départementales",

            lien:
                "Documents/ArreteNo14428MTSS-CAB.PDF"

        },


        {
            titre: "Loi n° 37-2014",

            categorie:
                "Instituant le régime d'assurance maladie universelle",

            lien:
                "Documents/Loi-n37-2014.pdf"

        },


        {
            titre: "Loi n° 12-2015",

            categorie:
                "Création de la Caisse d'assurance maladie",

            lien:
                "Documents/Loi-n12-2015-du-31-aout-2015.pdf"

        },


        {
            titre: "Loi n° 11-2014",

            categorie:
                "Portant création de la CR2PTSP",

            lien:
                "Documents/Loi-n11-2014.pdf"

        }

    ];


    const searchBar =
        document.getElementById("searchBar");

    const documentList =
        document.getElementById("documentList");


    /*
    -------------------------------------
    FONCTIONS UTILITAIRES POUR LES DOCUMENTS
    -------------------------------------
    */

    function removeAccents(text) {

        return text
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }


    function escapeHTML(text) {

        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function highlightText(text, search) {

        const safeText =
            escapeHTML(text);

        if (!search) {

            return safeText;

        }


        const escapedSearch =
            search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const regex =
            new RegExp(
                `(${escapedSearch})`,
                "gi"
            );


        return safeText.replace(
            regex,
            "<mark>$1</mark>"
        );

    }


    /*
    -------------------------------------
    AFFICHAGE ET FILTRAGE DES DOCUMENTS
    -------------------------------------
    Je filtre mon tableau de documents selon ce que je tape dans la barre de recherche.
    */

    function renderDocuments(search = "") {

        if (!documentList) {
            return;
        }


        const normalizedSearch =
            removeAccents(
                search
                    .toLowerCase()
                    .trim()
            );


        const filteredDocuments =
            documents.filter(doc => {

                const title =
                    removeAccents(
                        doc.titre.toLowerCase()
                    );


                const category =
                    removeAccents(
                        doc.categorie.toLowerCase()
                    );


                return (

                    title.includes(
                        normalizedSearch
                    )

                    ||

                    category.includes(
                        normalizedSearch
                    )

                );

            });


        documentList.innerHTML = "";


        if (
            filteredDocuments.length === 0
        ) {

            documentList.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="no-result"
                    >

                        Aucun document trouvé.

                    </td>

                </tr>

            `;

            return;

        }


        filteredDocuments.forEach(doc => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    ${highlightText(
                        doc.titre,
                        search
                    )}

                </td>


                <td>

                    ${highlightText(
                        doc.categorie,
                        search
                    )}

                </td>


                <td>

                    <a
                        href="${doc.lien}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        Lire

                    </a>

                </td>

            `;


            documentList.appendChild(row);

        });

    }


    /*
    -------------------------------------
    ÉCOUTEUR DE LA BARRE DE RECHERCHE
    -------------------------------------
    */

    if (searchBar) {

        searchBar.addEventListener(
            "input",
            event => {

                renderDocuments(
                    event.target.value
                );

            }
        );

    }


    // J'affiche tous les documents par défaut au chargement
    renderDocuments();


    /*
    =====================================
    MISE À JOUR AUTOMATIQUE DE L'ANNÉE DANS LE FOOTER
    =====================================
    */

    const footerYear =
        document.querySelector(
            ".footer-bottom p"
        );


    if (footerYear) {

        footerYear.innerHTML =
            `© ${new Date().getFullYear()}
            Ministère de la Sécurité Sociale,
            de la Prévoyance Sociale
            et de la Solidarité Nationale.
            Tous droits réservés.`;

    }


    /*
    =====================================
    SCROLL FLUIDE (NAVIGATION INTERNE)
    =====================================
    Je gère les clics sur les liens d'ancrage (#) pour 
    faire défiler la page en douceur en tenant compte de la hauteur de ma navbar fixe.
    */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".navbar"
                        );


                    const navbarHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const position =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        navbarHeight -
                        20;


                    window.scrollTo({

                        top: position,

                        behavior: "smooth"

                    });


                    if (
                        navLinks &&
                        navLinks.classList.contains(
                            "active"
                        )
                    ) {

                        navLinks.classList.remove(
                            "active"
                        );


                        if (menuToggle) {

                            menuToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }

                }
            );

        });

});


/*
=====================================
EFFET DE LA NAVBAR AU SCROLL (HORS DOMContentLoaded)
=====================================
Je détecte si la page défile vers le bas (plus de 50px) 
pour ajouter une classe "scrolled" à ma barre de navigation.
*/

const navbar = document.querySelector(".navbar");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}