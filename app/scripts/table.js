/* global $, swal */

function guidGenerator() {
    'use strict';
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '' + S4() + '' + S4() + '' + S4() + '' + S4() + S4() + S4());
}

function setId() {
    'use strict';
    var x = guidGenerator();
    $('#firstRow').attr('id', x);
}

setId();

/*eslint-disable new-cap*/
function addRow() {
    'use strict';
    $('.table').find('tbody').append(
        $('<tr id="' + guidGenerator() + '">').append(
            $('<td>').append(
                $('<input class="form-control" value="ga:pagePath==conversionista.se/" placeholder="ga:pagePath==example.com/" required />'))).append(
            $('<td class="res0">').append(
                $('<span>–</span>'))).append(
            $('<td>').append(
                $('<input class="form-control" value="ga:goal12Completions>0" placeholder="ga:pagePath==example.com/checkout" required />'))).append(
            $('<td class="res1">').append(
                $('<span>–</span>'))).append(
            $('<td>').append(
                $('<button class="btn btn-default btn-sm showGraph">Show Graph</button>'))).append(
            $('<td>').append(
                $('<button class="btn btn-link delete"><i class="fa fa-trash"></i></button>')))
    );
}
/*eslint-enable new-cap*/

function deleteRow(id) {
    'use strict';
    var i = '#' + id;
    swal({
            title: 'Are you sure?',
            text: 'This action can\'t be undone.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false
        },
        function() {
            $(i).remove();
            swal({
                title: 'Deleted!',
                text: 'The row has been deleted.',
                type: 'success',
                timer: 1000,
                showConfirmButton: false
            });
        });

}

function addDeleteListener() {
    'use strict';
    $('button.delete').on('click', function() {
        deleteRow($(this).parent().parent().attr('id'));
    });
}

function addGraphListener() {
    'use strict';
    $('.showGraph').on('click', function() {
        $('#modalChart').modal();
        var id = $(this).parent().parent().attr('id');
        window.setTimeout(function(){
          renderChart(id);
        }, 500);
    });
}
$('#addRow').click(function() {
    'use strict';
    /* Act on the event */
    addRow();
    addDeleteListener();
    addGraphListener();
});

$(document).ready(function() {
    'use strict';
    addGraphListener();
});
