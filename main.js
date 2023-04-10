/**
 * Author: Daniel Botchway
 * GitHub: https://github.com/BhoiDanny
 */

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

let $st = $.noConflict();
let $search = false;

function renderScreen($data, $word_no) {
    let $screen = $st('.screen');
    $screen.html('');
    $screen.append(`Searched Word: ${$data.word}<br>`);
    $screen.append(`No. of Words Found: ${$data.synonym_count}<br>`);
    $screen.append(`Synonyms: <br>`);
    $screen.append(`<ul></ul>`);
    if($word_no > $data.synonym_count) {
        $word_no = $data.synonym_count;
    } else if($word_no == 0) {
        $word_no = $data.synonym_count;
    }
    for(let i = 0; i < $word_no; i++) {
        $screen.find('ul').append(`<li>${$data.synonyms[i]}</li>`);
    }
}

function isAutoSearch() {
    let $check = $st('.auto-search').is(':checked');
    return $check;
}

//after typing in the input field and delay for 2 seconds
$st('input#word').on('keyup', function($e) {
    $e.stopPropagation();
    let $this = $st(this);
    $this.clearQueue();
    $this.delay(2000).queue(function(){
        if(isAutoSearch()) {
            $st('form.syn-form').submit();
        }
        $this.dequeue();
    });
});

//after typing in the number of words to display input field and delay for 2 seconds
$st('input#word_no').on('keyup', function($e) {
    $e.stopPropagation();
    let $this = $st(this);

    if(!$st('input#word').val() == "") {
        $this.clearQueue();
        $this.delay(2000).queue(function(){
            if(isAutoSearch()) {
                $st('form.syn-form').submit();
            }
            $this.dequeue();
        });
    }
});



$st('form.syn-form').on('submit', function($e) {
    $e.preventDefault();
    let $this = this;
    let $word = $st($this).find('input#word').val();
    let $word_no = $st($this).find('input#word_no').val();
    let $btn = $st($this).find('button[name="synonym_btn"]');
        
    function resolveBtn(){
        $btn.html("Check Synonyms");
        $btn.attr('disabled', false);
    }

    if($word == "") {
        toastr.error("Please Enter a Word","Field Check");
    } else {
        if($word_no == "") {
            $word_no = 0;
        }
        //remove spaces
        if($word.includes(" ")) {
            $word = $word.replace(/\s/g, '');
        }
        
        //check connectivity
        if(navigator.onLine) {
            try{
                $st.ajax({
                    url: encodeURI(`${$this.action}/${$word}`),
                    method: $this.method,
                    beforeSend: function() {
                        $btn.html('Checking...');
                        $btn.attr('disabled', true);
                        //close every other toastr
                        toastr.clear();
                    },
                    success: function ($res) {
                        if (!$res.success == true) {
                            toastr.error($res.messages, "Error");
                        } else {
                            toastr.success($res.messages, "Success");
                            renderScreen($res.data, $word_no);
                        }
                    }
                }).fail(function ($res) {
                    toastr.error($res.responseJSON.messages, $res.status);
                }).always(function () {
                    resolveBtn();
                });
            } catch ($e) {
                resolveBtn();
            }
        } else {
                toastr.error("Please Check Your Internet Connection", "Error");
        }
    }
    
});

$st('.clear').on('click', function() {
    $st('.screen').html('');
    $st('.screen').append('Results Here');
});