$('#tweet').click(function){

                var proxy = 'https://cors-anywhere.herokuapp.com/'
                var bufferLength, filePath, finished, fs, oauthCredentials, offset, request, segment_index, theBuffer;

                  request = require('request');
                  fs = require('fs');
                  filePath = 'http://techslides.com/demos/sample-videos/small.mp4';
                  bufferLength = 1000000;
                  theBuffer = new Buffer(bufferLength);
                  offset = 0;
                  segment_index = 0;
                  finished = 0;
                  oauthCredentials = {
                      consumer_key: 'LLPwgnBjYUvpGusXyyQb5QMAh',
                      consumer_secret: 'oCg6nwCy2HN3k1RgbP71xxLa8UQOEclKCFCrdnSbXLhO7KrnwG',
                      token: '162027406-utH1pSRECdzsFzFaaPI1ekeHmwKPGEvbcw3Tqqo6',
                      token_secret: 'IfDKKJyziu87ZhQWFoBW9l3ttoqWvDIT9t75Sn4qvmrOq'
                  };

                  fs.stat(filePath, function(err, stats) {
                      var formData, normalAppendCallback, options;

                      formData = {
                          command: "INIT",
                          media_type: 'video/mp4',
                          total_bytes: stats.size
                      };
                      options = {
                          url: 'https://upload.twitter.com/1.1/media/upload.json',
                          oauth: oauthCredentials,
                          formData: formData
                      };

                      normalAppendCallback = function(media_id) {
                          return function(err, response, body) {

                              finished++;
                              if (finished === segment_index) {

                                  options.formData = {
                                      command: 'FINALIZE',
                                      media_id: media_id
                                  };
                                  request.post(options, function(err, response, body) {
                                      console.log('FINALIZED',response.statusCode,body);

                                      delete options.formData;

                                      //Note: This is not working as expected yet.
                                      options.qs = {
                                          command: 'STATUS',
                                          media_id: media_id
                                      };
                                      request.get(options, function(err, response, body) {
                                          console.log('STATUS: ', response.statusCode, body);
                                      });
                                  });
                              }
                          };
                      };


                      request.post(options, function(err, response, body) {
                          var media_id;
                          media_id = JSON.parse(body).media_id_string;

                          fs.open(filePath, 'r', function(err, fd) {
                              var bytesRead, data;

                              while (offset < stats.size) {

                                  bytesRead = fs.readSync(fd, theBuffer, 0, bufferLength, null);
                                  data = bytesRead < bufferLength ? theBuffer.slice(0, bytesRead) : theBuffer;
                                  options.formData = {
                                      command: "APPEND",
                                      media_id: media_id,
                                      segment_index: segment_index,
                                      media_data: data.toString('base64')
                                  };
                                  request.post(options, normalAppendCallback(media_id));
                                  offset += bufferLength;
                                  segment_index++
                              }
                          });
                      });

                      
                  });
                };