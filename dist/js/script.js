jQuery(document).ready(function () {

    function getCountStars(classes) {
        const modify = classes.split(' ').find(className => className.includes('--'));
        const indexArg = modify.indexOf('--');

        return modify && modify.length > 0 && modify[indexArg + 2]
    }

    function getDeclinedRemainder(number, declensions) {
        const stringNumber = String(number);
        const [one, two, other] = declensions;
        let balance = number;
        if (balance > 20) {
            let lastSymbol = stringNumber[stringNumber.length - 1];
            balance = Number(lastSymbol);
        }

        if (balance === 1) {
            return `${number} ${one}`
        }
        if (balance < 5 && balance !== 0) {
            return `${number} ${two}`
        }
        return `${number} ${other}`
    }

    function getCounter(parent) {
        let counter = [];

        $('.dropdown__item', parent).each(function() {
            counter.push({
                title: $('.title', $(this)).text(),
                value: $('.counter__value', $(this)).val()
            })
        });

        return counter.filter(c => c.value > 0);
    }

    function changeTitle(parent) {
        const counter = getCounter(parent);
        const holder = parent.attr('holder');
        const totalParams = parent.attr('total-params');
        const select = $('.dropdown__select', parent);
        let text;

        if (counter.length === 0) {
            text = holder
        }

        else if (totalParams === undefined) {
            text = counter.map((count, index) => {
                let delimiter = index === 0 ? '' : ' ';
                return `${delimiter}${count.value} ${count.title}`
            });

        }

        else {
            const delitimer = totalParams.split(', ');
            const reducer = (accumulator, currentValue) => (accumulator + Number(currentValue.value))
            text = getDeclinedRemainder(counter.reduce(reducer, 0), delitimer);
        }

        select.text(text);

    }

    function addOverClass(parent) {
        parent.addClass('over');
        setTimeout(() => {
            parent.removeClass('over');
        }, 500)
    }

    function isCountersEmpty(parent) {
        const clear = $('.link__clear', parent);

        if (getCounter(parent).length === 0) {
            clear.hide();
        } else {
            clear.show();
        }
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

    $('.counter').each(function () {
        const $this = $(this);

        const btn_minus = $('.counter__btn--minus', $this);
        const btn_plus = $('.counter__btn--plus', $this);
        const counter = $('.counter__value', $this);
        const maxValue = $this.attr('max') || 10;

        btn_plus.click(function () {
            let value = Number(counter.val());
            if (value >= maxValue) {
                return;
            }
            counter.val( value + 1);
        });

        btn_minus.click(function () {
            let value = Number(counter.val());
            if (value === 0) {
                return;
            }
            counter.val(Number(counter.val()) - 1);
        });
    });

    $('.dropdown').each(function () {
        const $this = $(this);
        changeTitle($this);
        const select = $('.dropdown__select', $this);
        const clear = $('.link__clear', $this);
        const submit = $('.link__submit', $this);
        const counter_btns = $('.counter__btn', $this);

        isCountersEmpty($this);
        counter_btns.click(function () {
            isCountersEmpty($this);
        })


        select.click(function () {
            $this.toggleClass('opened');
            if (!$this.hasClass('opened')) {
                addOverClass($this);
                changeTitle($this);
            }
        });

        clear.click(function () {
            $('.counter__value', $this).val(0);
            clear.hide();
        });

        submit.click(function () {
            $this.removeClass('opened');
            addOverClass($this);
            changeTitle($this);
        });
    });

    $(document).click(function (event) {
        if ($(event.target).closest(".dropdown").length) return;
        $('.dropdown').each(function () {
            if ($(this).hasClass('opened')) {
                $(this).removeClass('opened');
                addOverClass($(this));
                changeTitle($(this));
            }
        })

        event.stopPropagation();
    });

});
