<script type="text/javascript">

                $('#connect').click(function() {
                var xhr = new XMLHttpRequest();
                var myurl = $("#imageurl").val();
                //document.getElementById("imageurl").value;
                var proxy = 'https://cors-anywhere.herokuapp.com/';

                xhr.open("GET", proxy+myurl, true);
                //$("#imageurl").val()
                // Ask for the result as an ArrayBuffer.
                xhr.responseType = "arraybuffer";

                xhr.onload = function( e ) {
                    // Obtain a blob: URL for the image data.
                    var arrayBufferView = new Uint8Array( this.response );
                    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    var img = document.querySelector( "#photo" );
                    img.src = imageUrl;

                    OAuth.initialize("9E1QYvmFw5KiKFRv9orP0vLvR1w", {cache:false});
                    

                    OAuth.popup("twitter").then(function(result) {
                        var data = new FormData();
                        data.append('status', $("#status").val());
                        data.append('media[]', blob);

                        
                        return result.post('/1.1/statuses/update_with_media.json', {
                            data: data,
                            cache:false,
                            processData: false,
                            contentType: false
                        });
                    }).done(function(data){
                        var str = JSON.stringify(data, null, 2);
                        $('#result').html("Success\n" + str).show()
                    }).fail(function(e){
                        var errorTxt = JSON.stringify(e, null, 2)
                        $('#result').html("Error\n" + errorTxt).show()
                      console.log(error);
                    });

                };
                xhr.send();
                });

                </script>