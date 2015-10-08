// Global Variables
var items = ["wakeuptime", "officetime", "backhometime", "dinnertime", "bedtime" ];
var bedroom = [];
var bathroom = [];
var kitchen = [];
var living = [];

// Main function
function heat_settings_main() {
	var url = get_api_url();
	// Ajax Call
	$.ajax({
 		url: url,
 		dataType: 'json',
 		success: function( data ) {
			
			// Error sent from backend is in String with length GT 4
			if (data.length > 4 ) {
				show_error(data);
				return;
			} 
			
			// If error from previous call, hide it on success
			show_error("");
			
			// Extract results from json into room varaibles
			bedroom = extract_values(data[0]);
			bathroom = extract_values(data[1]);
			kitchen = extract_values(data[2]);
			living = extract_values(data[3]);
			
			//make plot
			make_plots(bedroom,bathroom,kitchen,living); 
			
			//Savings calculation an dinserting text in html
			var saving_bedroom = compute_savings(bedroom);
			$("#savingbed").text(saving_bedroom + '%') ;
			var saving_bathroom = compute_savings(bathroom);
			$("#savingbath").text(saving_bathroom+ '%');
			var saving_kitchen = compute_savings(kitchen);
			$("#savingkitchen").text(saving_kitchen+ '%');
			var saving_living = compute_savings(living);
			$("#savingliving").text(saving_living+ '%');
			var saving_average = average_saving(saving_bedroom,saving_bathroom,saving_kitchen,saving_living);
			$("#savingaverage").text(saving_average+ '%');
 		},
		
 		error: function( data ) {
			// Ajax error
			show_error("Error in Ajax load");
			return;
 		}
	});
}

// Extract json format data into array
function extract_values(data){
		var temp_values = [];
  		$.each( data, function( key, val ) {		
    			temp_values.push(val);
  		});	
		return temp_values;
}
//extract values from html and create url with for GET
function get_api_url(){
	      var wakeuptime = $("#wakeuptime").val();
          var officetime = $("#officetime").val();
          var backhometime = $("#backhometime").val();
          var dinnertime = $("#dinnertime").val();
          var bedtime = $("#bedtime").val();
          var url ='http://astrotalks.org/heatsettings/HeatSettings.php?wakeuptime=' + wakeuptime + '&officetime=' + officetime + '&backhometime=' + backhometime + '&dinnertime=' + dinnertime + '&bedtime=' + bedtime;
		  return url;
}
// Show error message on html
function show_error(message) {
		$("#error_msg").text(message);
}
// load slider during page load
function load_slider(){
	var default_values = [6,10,18,20,23];
	$(function() {
			$( "#sliderwakeup" ).slider({
			  value:default_values[0],
			  min: 0,
			  max: 19,
			  step: 1,
			  slide: function( event, ui ) {
				$( "#wakeuptime" ).val(ui.value);
				$( "#slideroffice" ).slider( "option", "min", ui.value + 1 ); 
				$( "#officetime" ).val($( "#slideroffice" ).slider( "value" ));
				heat_settings_main();
			  }
			});		
		
			$( "#slideroffice" ).slider({
			  value:default_values[1],
			  min: default_values[0]+1,
			  max: 20,
			  step: 1,
			  slide: function( event, ui ) {
				$( "#officetime" ).val(ui.value);
				$( "#sliderbackhome" ).slider( "option", "min", ui.value + 1 ); 
				$( "#backhometime" ).val($( "#sliderbackhome" ).slider( "value" ));
				heat_settings_main();
			  }
			});
			$( "#sliderbackhome" ).slider({
			  value:default_values[2],
			  min: default_values[1]+1,
			  max: 21,
			  step: 1,
			  slide: function( event, ui ) {
				$( "#backhometime" ).val(ui.value);
				$( "#sliderdinner" ).slider( "option", "min", ui.value + 1 ); 
				$( "#dinnertime" ).val($( "#sliderdinner" ).slider( "value" ));
				heat_settings_main();  
			  }
			});
			  $( "#sliderdinner" ).slider({
			  value:default_values[3],
			  min: default_values[2]+1,
			  max: 22,
			  step: 1,
			  slide: function( event, ui ) {
				$( "#dinnertime" ).val(ui.value);
				$( "#sliderbed" ).slider( "option", "min", ui.value + 1 ); 
				$( "#bedtime" ).val($( "#sliderbed" ).slider( "value" )); 
				heat_settings_main();
			  }
			});
			 $( "#sliderbed" ).slider({
			  value:default_values[4],
			  min: default_values[3]+1,
			  max: 23,
			  step: 1,
			  slide: function( event, ui ) {
				$( "#bedtime" ).val(ui.value);
				heat_settings_main();  
			  }
			});	
			$( "#wakeuptime" ).val($( "#sliderwakeup" ).slider( "value" ));
			$( "#officetime" ).val($( "#slideroffice" ).slider( "value" ));
			$( "#backhometime" ).val($( "#sliderbackhome" ).slider( "value" ));
			$( "#dinnertime" ).val($( "#sliderdinner" ).slider( "value" ));
			$( "#bedtime" ).val($( "#sliderbed" ).slider( "value" ));
	});
}
//make plots
function make_plots(bedroom,bathroom,kitchen,living){
	 var x_axis_array = Array.apply(0, {length: 24}).map(Number.call, Number);
	$('#tempchart').highcharts({
		chart: {
			type: 'line'
		},
		title: {
			text: 'Heat Settings in Different Rooms',
		},
		xAxis: {
			categories: x_axis_array, 
			title: {
				text: 'Times in 24 hour clock'
			},	
		},
		yAxis: {
			title: {
				text: 'Point equivalents of temperature'
			},
			min : 0,
			max : 100
		},
		legend: {
		  layout: 'horizontal',
		  align: 'center',
		  verticalAlign: 'bottom',
		  borderWidth: 0
		},
		series: [{
			name: 'Bedroom',
			data: bedroom
		}, {
			name: 'Bathroom',
			data: bathroom
		},{
			name: 'Kitchen',
			data: kitchen
		},{
			name: 'Livingroom',
			data: living
		}]
	});
}
// compute savings per room
function compute_savings(x){
	var sum = 0;
	for (var i = 0 ; i < x.length; i++) {
    	sum += x[i];
   	}
	var saving = ((2400.0 - sum)/2400.0 )* 100;
	return saving.toFixed(2) ;	
}
//compute average savings of all rooms
function average_saving(bed,bath,kitchen,living){
	var avg_saving = ( parseFloat(bed) + parseFloat(bath) + parseFloat(kitchen) + parseFloat(living) ) / 4.0;
	return avg_saving.toFixed(2) ;
}