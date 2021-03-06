(function() {
	
	$(document).ready(function() {
		var timeoutId = 0;
		
		var url = window.location.href,
			parts = url.split('/'),
			active = parts[parts.length-1];

		jQuery('.nav-pills li').removeClass('active');
		jQuery('.nav-pills li a').each(function() {
			if (this.getAttribute('href').match(active)) {
				jQuery(this.parentNode).addClass('active');
				return false;
			}
		});
		
		jQuery('#search-user').on('keyup', function () {
			if(timeoutId !== 0) {
				clearTimeout(timeoutId);
				timeoutId = 0;
			}

			timeoutId = setTimeout(function() {
				var username = $('#search-user').val();
				
				jQuery('.icon-spinner').removeClass('none');
				socket.emit('api:admin.user.search', username);
			}, 250);
		});
		
		socket.removeAllListeners('api:admin.user.search');
		
		socket.on('api:admin.user.search', function(data) {
			
			jQuery('.icon-spinner').addClass('none');				
			
			if(data === null) {
				$('#user-notfound-notify').html('You need to be logged in to search!')
					.show()
					.addClass('label-important')
					.removeClass('label-success');
				return;
			}
			
			var html = templates.prepare(templates['users'].blocks['users']).parse({
					users: data
				}),
				userListEl = document.querySelector('.users');

			userListEl.innerHTML = html;


			if(data && data.length === 0) {
				$('#user-notfound-notify').html('User not found!')
					.show()
					.addClass('label-important')
					.removeClass('label-success');
			}
			else {
				$('#user-notfound-notify').html(data.length + ' user'+(data.length>1?'s':'') + ' found!')
					.show()
					.addClass('label-success')
					.removeClass('label-important');
			}

		});
		
		$('.reputation').each(function(index, element) {
			$(element).html(app.addCommas($(element).html()));
		});
		
		$('.postcount').each(function(index, element) {
			$(element).html(app.addCommas($(element).html()));
		});
		
	});

}());