<?php
Class HeatSettings{
	protected $bedroom;
    protected $livingroom;
    protected $kitchen;
    protected $bathroom;
  	protected $times;
	
	// A map to decide for each room to decide temperature settings
	protected $bedroom_setting = ["normal","off","off","off","off","normal"];
	protected $bathroom_setting = ["low","normal","off","low","low","low"];
	protected $kitchen_setting = ["off","normal","off","low","normal","off"];
	protected $livingroom_setting = ["off","off","off","normal","off","off"];

	//temperature settings
    protected $temps = array("off"=>0,"low"=>50,"normal"=>100);
	
	// min, max hours
	function set_times($values){
		$values[0] = 0;
		$values[6] = 24;
		$this->times = $values;
	}
	
	// Validate times. 
	function validate_times(){
		$msg = "";
		if ($this->times[1] < $this->times[0]) {
			$msg = "Wakeup time is set to very early";	
		}
		if ($this->times[2] <= $this->times[1]) {
			$msg = $msg . "Office time cannot be less than or equal to wakeuptime";
		}
		if ($this->times[3] <= $this->times[2]) {
			$msg = $msg . " Backhome time cannot be less or equal to officetime";	
		}
		if ($this->times[4] <= $this->times[3]) {
			$msg = $msg . " Dinner time cannot be less or equal to backhometime";
		}
		if ($this->times[5] <= $this->times[4]) {
			$msg = $msg . " Bedtime  cannot be less or equal to dinner";	
		}
		if ($this->times[5] >=24) {
			$msg = $msg . " Bedtime cannot be greater or equal to 24";
		}
		return $msg;
	}
	// Main function to create schedule
	function create_schedule(){
		for ($i=0 ; $i< 6; $i++){
			for ($j = $this->times[$i] ; $j < $this->times[$i+1] ; $j++){
	 			$this->bedroom[$j] = $this->temps[$this->bedroom_setting[$i]];
				$this->bathroom[$j] = $this->temps[$this->bathroom_setting[$i]];
				$this->kitchen[$j] = $this->temps[$this->kitchen_setting[$i]];
				$this->livingroom[$j] = $this->temps[$this->livingroom_setting[$i]];
			}
		}
		$result = [$this->bedroom,$this->bathroom,$this->kitchen, $this->livingroom];
		return $result;
	}
	// print function to use, if needed
	function printvalues(){
		print_r([$this->bedroom,$this->bathroom,$this->kitchen, $this->livingroom]);
	}
}


?>