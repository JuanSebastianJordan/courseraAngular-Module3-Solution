(function (){
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',FoundItems)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com");

function FoundItems(){
    var ddo={
        restrict: 'E',
        templateUrl: 'list.html',
        scope: {
            foundItems: '<',
            onRemove: '&',
           
        },
        controller: NarrowItDownController,
        controllerAs: 'contr',
        bindToController: true
    };
    return ddo;
}

NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
    var contr= this;
    contr.search="";

    contr.list= function(searchTerm){
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
        

        promise.then(function(menu){
            if(menu.length >0 && menu){
                contr.men="";
                contr.menuMatch=menu;
            }
            else{
                contr.men="Nothing Found!";
                contr.menuMatch=[];
            }
        });
    };
    
    

    contr.removeItem= function (itemIndex) {
        
        contr.menuMatch.splice(itemIndex,1);
        
      }
    

}

MenuSearchService.$inject=['$http','ApiBasePath']
function MenuSearchService($http,ApiBasePath){
    var service= this;

    service.getMatchedMenuItems= function(searchTerm){
        return $http({
            method: "GET",
            url: (ApiBasePath + "/menu_items.json")
        }).then(function (response){
            var foundItems=[];
            console.log(response.data['menu_items'][0]['description'])
            
           for(var i=0; response.data['menu_items'].length;i++){

               if(response.data['menu_items'][i]['description'].indexOf(searchTerm)==!-1){

                   foundItems.push(response.data['menu_items'][i]);
               }
             
           }


            console.log(response.data)
            return foundItems;
        });
    };

}


})();