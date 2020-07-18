let data_type = $('#data-type').text();
let data_subject = $('#data-subject').text();


function load_sources() {
    let data = {"subject": data_subject};

    $.getJSON("sources", data,
    function(sources) {
        var $dropdown = $("#select-source");
        // Remove all the options
        $dropdown.find('option').remove();

        $dropdown.append($("<option selected='selected' />").val('-1').text('הכל'));
        $.each(sources, function() {
            $dropdown.append($("<option />").val(this).text(this));
        });
    });
}

function load_topics() {
    let data = {"subject": data_subject};

    $.getJSON("topics", data,
    function(sources) {
        var $dropdown = $("#select-topic");
        // Remove all the options
        $dropdown.find('option').remove();

        $dropdown.append($("<option selected='selected' />").val('-1').text('הכל'));
        $.each(sources, function() {
            $dropdown.append($("<option />").val(this).text(this));
        });
    });
}



