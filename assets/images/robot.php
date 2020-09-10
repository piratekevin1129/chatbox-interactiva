<?php 
$icons = scandir('icons');
//for($i = 2;$i<count($icons);$i++){
	//echo "'".$icons[$i]."',<br />";
//}
for($i = 2;$i<count($icons);$i++){
	$name = explode("-", $icons[$i]);
	$class = explode(".",$name[1]);
	$clase = str_replace(" ", "-", $class[0]);
	echo ".".$clase."{background-image:url(../images/icons/".$icons[$i].");}<br />";
}

?>