$(document).ready(function() {
	//Initially hide contact button
	$('#hideContacts').hide();

    //antonio changing 1
    var host = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(host);

    // GET/READ display hide button, hide view button.
    $('#getContacts').on('click', function() {
        getContacts();
        $('#getContacts').hide();
        $('#hideContacts').show();
        $('table').show();
    	$('tbody').show();
    });
    //HIDE HIDE BUTTON AND SHOW VIEW BUTTON AND CONTACTS
    $('#hideContacts').on('click', function() {
    	$('#getContacts').show();
    	$('table').hide();
    	$('tbody').hide();
    	$('#hideContacts').hide();
    })
    // CREATE/POST
    $('#addContact').on('submit', function(event) {
        event.preventDefault();

        var InputName1 = $('#InputName1');
        var InputName2 = $('#InputName2');
        var InputEmail = $('#InputEmail');


        $.ajax({
            url: '/contacts',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ firstName: InputName1.val(), lastName: InputName2.val(), email: InputEmail.val() }),
            success: function(response) {
                console.log(response);
                InputName1.val('');
                InputName2.val('');
                InputEmail.val('');

                $('#getContacts').click();               
            	console.log(response);
            }

        });
    });

    // UPDATE/PUT
    $('table').on('click', '.update-button', function() {
        var rowEl = $(this).closest('tr');
        var id = rowEl.find('.id').text();
        var newFirstName = rowEl.find('.InputName1').val();
        var newLastName = rowEl.find('.InputName2').val();
        var newEmail = rowEl.find('.InputEmail').val();



        $.ajax({
            url: '/contacts/' + id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ newFirstName: newFirstName, newLastName: newLastName, newEmail: newEmail }),
            success: function(response) {
                console.log(response);
                $('#getContacts').click();
            }
        });
    });

    // DELETE
    $('table').on('click', '.delete-button', function() {
        var rowEl = $(this).closest('tr');
        var id = rowEl.find('.id').text();

        $.ajax({
            url: '/contacts/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $('#getContacts').click();
            }
        });
    });

    function getContacts(){
    	$.ajax({
            url: '/contacts',
            contentType: 'application/json',
            success: function(response) {
                var tbody = $('tbody');

                tbody.html('');

                response.contacts.forEach(function(contact) {
                    tbody.append('\
                        <tr>\
                            <td class="id">' + contact.id + '</td>\
                            <td><input type="text" class="InputName1" value="' + contact.firstName + '"></td>\
                            <td><input type="text" class="InputName2" value="' + contact.lastName + '"></td>\
                            <td><input type="text" class="InputEmail" value="' + contact.email + '"></td>\
                            <td>\
                                <button class="update-button">UPDATE</button>\
                                <button class="delete-button">DELETE</button>\
                            </td>\
                        </tr>\
                    ');
                    console.log(contact);
                });
            }
        });
    };
});