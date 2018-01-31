            $('#tweet').click(function() {
                var xhr = new XMLHttpRequest();
                var myurl = $("#image").val();
                var proxy = 'https://cors-anywhere.herokuapp.com/';
                xhr.open("GET", proxy+myurl, true);
                // Ask for the result as an ArrayBuffer.
                xhr.responseType = "arraybuffer";
                xhr.onload = function( upload ) {
                    // Obtain a blob: URL for the image data.
                    var arrayBufferView = new Uint8Array( this.response );
                    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    var img = document.querySelector( "#photo" );
                    img.src = imageUrl;
                    //Oauth Initialization with oauth public API key
                    OAuth.initialize("1IyF0Z833FqYEfeuwPV04s59jDw", {cache:false});
                    OAuth.popup("twitter").then(function(result) {
                        var data = new FormData();
                        data.append('status', "Amazing picture");
                        data.append('media[]', blob);
                        return result.post('/1.1/statuses/update_with_media.json', {
                            data: data,
                            cache:false,
                            processData: false,
                            contentType: false
                        });
                    }).done(function(data){
                        var str = JSON.stringify(data, null, 2);
                        $('#result1').html("Picture Successfully Tweeted!\n").show()
                    }).fail(function(upload){
                        var errorTxt = JSON.stringify(e, null, 2)
                        $('#result2').html("Error! Try again to upload!\n").show()
                      console.log(error);
                    });
                };
                xhr.send();
            });