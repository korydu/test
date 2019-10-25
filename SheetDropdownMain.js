'use strict';

function StartFunction() {
	
	(function () {
	  $(document).ready(function () {
		tableau.extensions.initializeAsync().then(function() {
			GetData();
		});
	  });
	  
		let unregisterEventHandlerFunction;
		let unregisterEventHandlerFunction2;
	  
		function GetData() {
			
		if (unregisterEventHandlerFunction) {
		  unregisterEventHandlerFunction();
		}

		if (unregisterEventHandlerFunction2) {
		  unregisterEventHandlerFunction2();
		}

		let dashboard = tableau.extensions.dashboardContent.dashboard;

			dashboard.worksheets.forEach(function (worksheet) {
				if(worksheet.name == "Sheet 23") //"PONumbers"
				{
					worksheet.getSummaryDataAsync().then(dataTable => {  
						let field = dataTable.columns.find(column => column.fieldName === 'SerialNumber');  //'PONumber'
						let values = [];  
						for (let row of dataTable.data)
						{				
							values.push(row[field.index].value);  
						}
											
						var arrstring = values.toString().split(",");					
						var stringresult="";
						
						for (var temp=0; temp <= arrstring.length-1; temp++) 
						{
							if(stringresult=="")
							{
								stringresult =  arrstring[temp];
							}
							else
							{
								stringresult = stringresult +  '\n' + arrstring[temp];
							}
						}
						
						if(arrstring.length > 500)
						{
							document.getElementById("CopyBtn").disabled = true;
						}
						else
						{
							document.getElementById("CopyBtn").disabled = false;
						}
						
						$('#ExtractedValues').empty();
						$('#ExtractedValues').append(stringresult);
						
						unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, function (selectionEvent) {
						  GetData();
						});
						
						unregisterEventHandlerFunction2 = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, function (selectionEvent) {
						  GetData();
						});
					});  
				}
			});
		}
	})();
}

function CopyToClipboard(element) {
	var $temp = $("<textarea>");
	$("body").append($temp);
	$temp.val($(element).text()).select();
	document.execCommand("copy");
	$temp.remove();
}