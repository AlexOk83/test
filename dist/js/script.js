jQuery(document).ready(function () {

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
        let cost_max = $('#last-'+ id).text() * 1;

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
            const cost_last  = $(`#last-${id}`);
            const input_min = $(`#count-min-${id}`);
            const input_max  = $(`#count-max-${id}`);

            let value = values[handle];
            if (handle) {
                cost_last.text(Math.round(value));
                input_max.val(Math.round(value))
            } else {
                cost_first.text(Math.round(value));
                input_min.val(Math.round(value))
            }
        });
    });


});
