jQuery(document).ready(function () {

    $('.form-control__like').click(function () {
        let $this = $(this);
        let counter = $('input', $this);
        if ($this.hasClass('clicked')) {
            return;
        }
        $this.addClass('clicked');
        let count = counter.val();
        console.log(count);
        counter.val(Number(count) + 1);
    });


});
