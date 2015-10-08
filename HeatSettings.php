<?php
// Print results 
function print_results($x) {
	print_r(json_encode($x));
}
// Check and validate GET parameters
$input_params = ['wakeuptime','officetime','backhometime','dinnertime','bedtime'];
for ($i = 0; $i < count($input_params); $i++){
	if (isset ($_GET[$input_params[$i]])){
		$value = $_GET[$input_params[$i]];
		if (is_numeric($value)) {
			$times[$i+1] = $value;
		} else {
			$msg = $value . " is not a number. Please enter a valid " . $input_params[$i];
			print_results($msg);
			return ;
		}
	} else { 
		$msg = "Please provide time for " . $input_params[$i];
		print_results($msg);
		return ;
	}
}

require ("HeatSettingsClass.php");
$x = new HeatSettings();

// Provide time input to the object
$x->set_times($times);

// Validate times 
$validate = $x->validate_times();

if (strlen($validate) < 5){
	// Create Schedule and print
	$result = $x->create_schedule();
	print_results($result);
} else {
	// On Validation Error
	print_results($validate);
}
?>