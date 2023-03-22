class FormLoader
{
    pages = [/jonathan-plain-html-form-loading-state'];
    find   = {interval: null, tries: 0, name: null, company: null};
    popup = {target: null, class: '.chilipiper-popup', ready: false, interval: null, tries: 0};

    constructor()
    {
        let enabled = false;

        $.each(this.pages, function(index, page)
        {
            if(window.location.pathname.startsWith(page))
            {
                enabled = true;
                return false;
            }
        });

        if(!enabled)
        {
            return;
        }

        this.prepareClick();
        this.prepareListener();
        this.prepareStyle();
    }

    sanitize(string)
    {
        return string.replace(/[^\w. ]/gi, function (c)
        {
            return '&#' + c.charCodeAt(0) + ';';
        });
    }

    prepareStyle()
    {
        $('head').append(`
            <style>
                .form-animation 
                {
                    position: fixed;
                    width: 100vw;
                    height: 100vh;
                    background: #000000a8;
                    z-index: 99999999999999;
                    top: 0;
                    left: 0;
                }
                
                .form-animation .fm-an-box 
                {
                    max-width: 560px;
                    width: 100vw;;
                    left: 0;
                    top: 0;
                    z-index: 999999;
                    position: fixed;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    padding: 100px 65px;
                    background: #FFFFFF;
                    box-shadow: 0 48px 64px rgb(0 26 94 / 10%);
                    border-radius: 32px;
                    text-align: center;
                    height: fit-content;
                    max-height: 100vh;
                    overflow: auto;
                }
                
                .form-animation .fm-an-loader
                {
                    border: 10px solid #F7F9FA;
                    width: 220px;
                    height: 220px;
                    border-radius: 47px;
                    margin: 0 auto;
                    padding: 10px;
                }
                
                .form-animation .fm-an-loader > div
                {
                    overflow: hidden;
                }
                
                .form-animation .fm-an-loader > div > img
                {
                    transform: scale(1.004);
                }
                
                .form-animation .js-fm-an-small
                {
                    font-family: 'Bayon';
                    font-weight: 400;
                    font-size: 18px;
                    line-height: 18px;
                    text-align: center;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #FF5721;
                    margin-bottom: 16px;
                    margin-top: 50px;
                }
                
                .form-animation .js-fm-an-big
                {
                    font-style: normal;
                    font-weight: 700;
                    font-size: 37px;
                    line-height: 42px;
                    text-align: center;
                    letter-spacing: -0.02em;
                    font-feature-settings: 'liga' off;
                    color: #252C47;
                    min-height: 90px;
                }
                
                @media screen and (max-width: 992px) 
                {
                    .form-animation .fm-an-box 
                    {
                        padding: 60px 30px;
                    }
                    
                    .form-animation .js-fm-an-small
                    {
                        font-size: 16px;
                        margin-bottom: 8px;
                        margin-top: 25px;
                    }
                    
                    .form-animation .js-fm-an-big
                    {
                        font-size: 30px;
                        min-height: 70px;
                    }
                }
            </style>
        `);
    }

    prepareClick()
    {
        $(document).on('click', '.chillisubmit', (event) =>
        {
            /* Initial State */
            this.popup.target = null;
            this.popup.ready = false;
            this.popup.tries = 0;

            clearInterval(this.find.interval);
            clearInterval(this.popup.interval);

            this.popup.interval = null;
            this.find.interval = null;

            this.find.interval = setInterval(() =>
            {
                this.find.tries++;

                /* Handle Tries */
                if(this.find.tries > 20)
                {
                    clearInterval(this.find.interval);

                    this.find.interval = null;
                    this.find.tries = 0;

                    console.log('Animation Loader: Failed to find ChiliPiper popup.');

                    return false;
                }

                /* Get Popup */
                this.popup.target = $(this.popup.class); if(!this.popup.target.length) { return true; }

                /* Name & Company */
                this.find.name = $(event.target).closest('form').find('input[name="firstname"]').val();
                this.find.company = $(event.target).closest('form').find('input[name="company"]').val();

                /* Start Animation */
                this.animationStart();

                /* Clear Interval */
                clearInterval(this.find.interval);

                /* Reset Find */
                this.find.interval = null;
                this.find.tries = 0;

                console.log('Animation Loader: ChiliPiper popup found.');
            }, 100);
        });
    };

    prepareListener()
    {
        window.addEventListener('message', (event) =>
        {
            if(event.data.action === 'SetIframeSize')
            {
                this.popup.ready = true;
            }
        }, false);
    };

    animationStart()
    {
        /* Hide */
        this.popup.target.css('opacity', 0);

        /* Blur */
        let blur = $('.js-animation-blur');
        if(!blur.length) { console.log('Consider setting class ".js-animation-blur" on a div for blur effect.'); }

        blur.css('filter', 'blur(5px)');

        /* Append Loader */
        this.popup.target.after(`
            <div class="form-animation">
                 <div class="fm-an-box" style="display: none">
                    <div class="fm-an-loader">
                        <div>
                            <img src="https://global.divhunt.com/clients/chilipiper/bookademo.gif" alt="Book a Demo">
                        </div>
                    </div>
                    
                    <p class="js-fm-an-small">Almost ready to book....</p>
                    <p class="js-fm-an-big"  data-type="start">Hi ${this.sanitize(this.find.name)} ðŸ‘‹</p>
                </div>
            </div>
        `);

        /* Fade In */
        $('.form-animation > .fm-an-box').fadeIn('slow');

        this.popup.interval = setInterval(() =>
        {
            /* Tries */
            this.popup.tries++;

            /* Data */
            let company = this.find.company;

            /* Handle Ready */
            if(!this.popup.ready || this.popup.tries < 20)
            {
                if(this.popup.tries > 0 && this.popup.tries < 5)
                {
                    return $('.js-fm-an-big[data-type="start"]').attr('data-type', '1');
                }
                else if(this.popup.tries >= 5 && this.popup.tries < 10)
                {
                    return $('.js-fm-an-big[data-type="1"]').attr('data-type', '2').fadeOut('fast', function()
                    {
                        $(this).text(`Finding the best rep for ${company}`);
                        $(this).fadeIn('fast');
                    });
                }
                else if(this.popup.tries >= 10  && this.popup.tries < 15)
                {
                    return $('.js-fm-an-big[data-type="2"]').attr('data-type', '3').fadeOut('fast', function()
                    {
                        $(this).text('Pulling up your Chili Expert's calendar');
                        $(this).fadeIn('fast');
                    });
                }
                else
                {
                    return $('.js-fm-an-big[data-type="3"]').attr('data-type', '4').fadeOut('fast', function()
                    {
                        $(this).text('Stay spicy ðŸŒ¶ï¸');
                        $(this).fadeIn('fast');
                    });
                }
            }

            clearInterval(this.popup.interval);

            this.popup.interval = null;
            this.popup.tries = 0;

            console.log('Animation Loader: ChiliPiper popup is ready.');

            /* Show Popup */
            this.popup.target.css('opacity', 1);

            /* Remove Animation */
            $('.form-animation').fadeOut('medium', function()
            {
                $(this).remove();
            });

            /* Blur */
            blur.css('filter', '');
        }, 500);
    };
}

new FormLoader();