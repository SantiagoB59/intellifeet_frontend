import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  currentYear = new Date().getFullYear();

  private observer ?: IntersectionObserver;


  ngAfterViewInit(): void {

    this.initScrollAnimations();

    this.initSectionObserver();

    this.initScrollProgress();

  }


  ngOnDestroy(): void {

    this.observer?.disconnect();

    window.removeEventListener(
      'scroll',
      this.handleScroll
    );

  }


  /* =====================================================
     REVEAL ANIMATIONS
  ====================================================== */

  private initScrollAnimations(): void {

    const elements =
      document.querySelectorAll('.reveal');


    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add('visible');

            }

          });

        },

        {
          threshold: 0.12
        }

      );


    elements.forEach(element => {

      observer.observe(element);

    });

  }


  /* =====================================================
     ACTIVE NAVBAR
  ====================================================== */

  private initSectionObserver(): void {

    const sections =
      document.querySelectorAll(
        '.landing-section'
      );


    const navLinks =
      document.querySelectorAll(
        '.nav-link'
      );


    this.observer =
      new IntersectionObserver(

        entries => {

          const visibleSections =
            Array.from(entries)
              .filter(
                entry =>
                  entry.isIntersecting
              );


          if (!visibleSections.length) {
            return;
          }


          const current =
            visibleSections
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )[0];


          const sectionId =
            current.target.getAttribute(
              'data-section'
            );


          if (!sectionId) {
            return;
          }


          navLinks.forEach(link => {

            const linkSection =
              link.getAttribute(
                'data-section'
              );


            link.classList.toggle(
              'active',
              linkSection === sectionId
            );

          });

        },

        {
          root: null,

          rootMargin:
            '-25% 0px -60% 0px',

          threshold: [
            0,
            0.1,
            0.25,
            0.5
          ]

        }

      );


    sections.forEach(section => {

      this.observer?.observe(section);

    });

  }


  /* =====================================================
     SCROLL PROGRESS
  ====================================================== */

  private initScrollProgress(): void {

    window.addEventListener(
      'scroll',
      this.handleScroll,
      {
        passive: true
      }
    );

    this.handleScroll();

  }


  private handleScroll = (): void => {

    const scrollTop =
      window.scrollY;


    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;


    if (documentHeight <= 0) {
      return;
    }


    const progress =
      (scrollTop / documentHeight) * 100;


    const progressBar =
      document.querySelector(
        '.scroll-progress-bar'
      ) as HTMLElement | null;


    if (progressBar) {

      progressBar.style.width =
        `${progress}%`;

    }

  };

}

