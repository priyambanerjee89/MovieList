var MovieList = new Meteor.Collection('movieList');


if (Meteor.isClient) {

    Session.set("currGenre",'Select a genre');
    Session.set('sort_order',{title:1});//sort asc title on load
    Session.set("twitterLoginName","My")


    
    //get all movies from movieList collection
    Template.movieTable.movieList = function(){
      return MovieList.find({},{sort: Session.get('sort_order')});
    };

    //set sort handler
    Template.movieTable.events({
      'click th': function(e,t){
        var sortTargetID = e.target.id;
        var sortDir = e.target.className;
        var sortTarget = sortTargetID.split('-')[0];

        if(sortDir == 'asc'){
            if(sortTarget == 'title'){
              Session.set('sort_order',{title:1});
            }
            else if(sortTarget == 'releaseYear'){
              Session.set('sort_order',{releaseYear:1});
            }
            else if(sortTarget == 'genre'){
              Session.set('sort_order',{genre:1});
            }

          e.target.className = 'desc';
        }
        else if(sortDir == 'desc'){
          if(sortTarget == 'title'){
            Session.set('sort_order',{title:-1});
          }
          else if(sortTarget == 'releaseYear'){
            Session.set('sort_order',{releaseYear:-1});
          }
          else if(sortTarget == 'genre'){
            Session.set('sort_order',{genre:-1});
          }
          e.target.className = 'asc';
        }
     
      }
    });


    //set flag if editing
    Template.movieForm.editing = function(){
      return Session.get("edit");
    };


    //Add/Update event handlers
    Template.movieForm.events({
      'click #addMovie': function(e,t){
        //get the form input elements
        var thisTitle = t.find('#title');
        var thisReleaseYear = t.find('#releaseYear');
        var thisGenre = t.find('#genre');
        var validation = true;

        //do some basic validation
        if(thisTitle.value == ''){
          alert('Please enter a movie title!');
          validation = false;
        }
        else if(thisReleaseYear.value == ''){
          alert('Please enter a release year!');
          validation = false;
        }
        else if(thisReleaseYear.value.length != 4 || thisReleaseYear.value.match(/^[0-9]+$/) == null){
          alert('Release Year must be a 4 digit number');
          validation = false;
        }
        else if(thisGenre.value == 'Select a genre'){
          alert('Please select a genre');
          validation = false;
        }
        
        if(validation){
          //insert data to MovieList collection
          MovieList.insert({title:thisTitle.value, releaseYear:thisReleaseYear.value, genre:thisGenre.value});
          //sort by movie name
          Session.set('sort_order',{title:1});
          
          //reset input fields
          thisTitle.value = '';
          thisReleaseYear.value = '';
          thisGenre.value = 'Select a genre';
        }
        

      },
      'click #updateMovie': function(e,t){
        //get the form input elements
        var thisTitle = t.find('#title');
        var thisReleaseYear = t.find('#releaseYear');
        var thisGenre = t.find('#genre');
        var validation = true;

        //do some basic validation
        if(thisTitle.value == ''){
          alert('Please enter a movie title!');
          validation = false;
        }
        else if(thisReleaseYear.value == ''){
          alert('Please enter a release year!');
          validation = false;
        }
        else if(thisReleaseYear.value.length != 4 || thisReleaseYear.value.match(/^[0-9]+$/) == null){
          alert('Release Year must be a 4 digit number');
          validation = false;
        }
        else if(thisGenre.value == 'Select a genre'){
          alert('Please select a genre');
          validation = false;
        }

        if(validation){
          //update the selected movie with new data
          MovieList.update(Session.get("currEditID"),{$set: {title:thisTitle.value, releaseYear:thisReleaseYear.value, genre:thisGenre.value}});
          //sort by movie name
          Session.set('sort_order',{title:1});

          //done editing, turn flag off...
          Session.set("edit",false);
          //...and reset input fields
          thisTitle.value = '';
          thisReleaseYear.value = '';
          Session.set("currGenre",'Select a genre');
          thisGenre.value = 'Select a genre';
          thisGenre.selectedIndex = 0;
        }
         
      }
    });

    //Edit/Delete event handlers
    Template.movie.events({
      'click #editMovie': function (e,t) {
        //starting editing, turn flag on
        Session.set("edit",true);
        //set which id is being edited, so we can use it for updating later
        Session.set('currEditID',t.data._id);
        
        //get values for the movie we are editing
        var currTitle = t.data.title;
        var currReleaseYear = t.data.releaseYear;
        var currGenre = t.data.genre;
        
        //set these values in Session for editing/updating
        Session.set("currTitle",currTitle);
        Session.set("currReleaseYear",currReleaseYear);
        Session.set("currGenre",currGenre);

      },
      'click #deleteMovie': function(e,t){
        MovieList.remove(t.data._id);
      }
    });

    Template.movieForm.currTitle = function(){
      return Session.get("currTitle");
    };

    Template.movieForm.currReleaseYear = function(){
      return Session.get("currReleaseYear");
    };

    Template.movieForm.currGenre = function(){
      return Session.get("currGenre");
    };

    Template.content.twitterLoginName = function(){
      return Session.get("twitterLoginName");
    };

    //set user name in page header
    /*Template.content.rendered = function(){
      var twitterLoginName = this.find('.login-display-name');
      console.log(twitterLoginName);
      if(twitterLoginName.length > 0 ){
        Session.set("twitterLoginName",twitterLoginName.innerHTML);
      }
      
    };*/

    //Genre options
    Template.movieForm.genreOptions = ['Foreign','Action','Thriller','Comedy','Drama'];
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
