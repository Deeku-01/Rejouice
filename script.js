function locoscroll() {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        multiplier: 1,
        class: "is-revealed"
    });

    // Sync ScrollTrigger with Locomotive Scroll
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
    
    return locoScroll;
}

// Enhanced Custom Cursor Effect - More robust version
function cursorEffect() {
    const page1Content = document.querySelector("#page1-content");
    const cursor = document.querySelector("#cursor");
    let isInside = false;

    // Initially hide cursor
    gsap.set(cursor, { scale: 0, opacity: 0 });

    // Global mouse movement listener with requestAnimationFrame for smoother performance
    let mouseMoveRAF;
    window.addEventListener("mousemove", function(e) {
        if (mouseMoveRAF) {
            cancelAnimationFrame(mouseMoveRAF);
        }
        
        mouseMoveRAF = requestAnimationFrame(() => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });
    });

    // Check if mouse is inside page1-content area
    function checkMouseInside(e) {
        const rect = page1Content.getBoundingClientRect();
        return e.clientX >= rect.left && 
               e.clientX <= rect.right && 
               e.clientY >= rect.top && 
               e.clientY <= rect.bottom;
    }

    // Global mouse move to check if inside area (works better with Locomotive Scroll)
    window.addEventListener("mousemove", function(e) {
        const shouldShow = checkMouseInside(e);
        
        if (shouldShow && !isInside) {
            isInside = true;
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        } else if (!shouldShow && isInside) {
            isInside = false;
            gsap.to(cursor, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    // Fallback event listeners
    page1Content.addEventListener("mouseenter", function(e) {
        if (!isInside) {
            isInside = true;
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    page1Content.addEventListener("mouseleave", function(e) {
        if (isInside) {
            isInside = false;
            gsap.to(cursor, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

// Page 2 Animation

// Fixed Page 2 Animation
function page2Animation() {
    // Animate all h2 elements within .elem class
    gsap.from(".elem h2", {
        y: 120,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#page2",
            scroller: "#main",
            start: "top 70%",
            end: "top 30%",
            scrub: 2,
            markers: true // Add this temporarily to debug
        }
    });
}

// Initialize everything
function init() {
    // Initialize cursor effect first
    cursorEffect();
    
    // Then initialize Locomotive Scroll
    const locoScrollInstance = locoscroll();
    
    // Initialize page animations after a brief delay
    setTimeout(() => {
        page2Animation();
    }, 100);
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", init);