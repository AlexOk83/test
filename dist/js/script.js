jQuery(document).ready(function () {

    function getCountStars(classes) {
        const modify = classes.split(' ').find(className => className.includes('--'));
        const indexArg = modify.indexOf('--');

        return modify && modify.length > 0 && modify[indexArg + 2]
    }

    $('.form-control__like').click(function () {
        let $this = $(this);
        let counter = $('input', $this);
        let count = counter.val();
        if ($this.hasClass('clicked')) {
            $this.removeClass('clicked');
            counter.val(Number(count) - 1);
            return;
        }
        $this.addClass('clicked');
        counter.val(Number(count) + 1);
    });

    $('.form-control__range').each(function () {
        const $this = $(this);
        const id = $this.attr('data-id');
        const slider_min = $this.attr('data-min') * 1;
        const slider_max = $this.attr('data-max') * 1;
        const costSlider = document.getElementById('slider-' + id);

        let cost_min = $('#first-' + id).text() * 1;
        let cost_max = $('#last-' + id).text() * 1;

        noUiSlider.create(costSlider, {
            start: [cost_min, cost_max],
            connect: true,
            step: 100,
            range: {
                'min': slider_min,
                'max': slider_max
            }
        });

        costSlider.noUiSlider.on('update', function (values, handle) {
            const cost_first = $(`#first-${id}`);
            const cost_last = $(`#last-${id}`);
            const input_min = $(`#count-min-${id}`);
            const input_max = $(`#count-max-${id}`);

            let value = values[handle];
            if (handle) {
                cost_last.text(Math.round(value));
                input_max.val(Math.round(value));
            } else {
                cost_first.text(Math.round(value));
                input_min.val(Math.round(value));
            }
        });
    });

    $('.form-control__rate').each(function () {
        const $this = $(this);
        const star = $('.star', $this);
        let oldClasses = $this.attr('class');

        star.hover(function () {
            if ($this.hasClass('clicked')) {
                return;
            }

            const starClasses = $(this).attr('class');
            const stars = getCountStars(starClasses);
            $this
                .removeClass()
                .addClass(`form-control__rate form-control__rate--${stars}0`);
        });

        $this.mouseleave(function () {
            if ($this.hasClass('clicked')) {
                return;
            }

            $this
                .removeClass()
                .addClass(oldClasses);
        });

        $this.click(function() {
            if ($this.hasClass('clicked')) {
                return;
            }

            const starClasses = $this.attr('class');
            const arg = getCountStars(starClasses);
            console.log(`Вы поставили ${arg} звезды`);
            oldClasses = starClasses;
            $this.addClass('clicked');
        })
    });

});
