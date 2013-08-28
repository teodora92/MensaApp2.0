<?php

require 'Slim/Slim.php';

$app = new Slim();


$app->get('/getMenu/:mensaID/:day', 'getMenu');


$app->run();

function post_to_url($url, $data) {
   $fields = '';
   foreach($data as $key => $value) { 
      $fields .= $key . '=' . $value . '&'; 
   }
   rtrim($fields, '&');

   $post = curl_init();

   curl_setopt($post, CURLOPT_URL, $url);
   curl_setopt($post, CURLOPT_POST, count($data));
   curl_setopt($post, CURLOPT_POSTFIELDS, $fields);
   //curl_setopt($post, CURLOPT_RETURNTRANSFER, 1);

   $result = curl_exec($post);
   
   curl_close($post);
   
   //echo $result;
}

function parse($text) {
    // Damn pesky carriage returns...
    $text = str_replace("\r\n", "\n", $text);
    $text = str_replace("\r", "\n", $text);

    // JSON requires new line characters be escaped
    $text = str_replace("\n", "\\n", $text);
	//$text = str_replace("\\", "\\\\", $text);
	$text = str_replace("\t", "\\t", $text);
	$text = str_replace("\"", "\\\"", $text);
    return $text;
}

function getMenu($mensaID, $day) {
	$fields = array(
		'R1' => substr($day, 1),
		'mensa' => substr($mensaID, 1)
	);
	header('Content-Type:text/html; charset=windows-1252');
	header('Content-language: de');
	ob_start();
	post_to_url("http://www.kstw.de/handy/default.asp?act=show", $fields);
	$variable = ob_get_contents();
	
	$pos = strpos($variable, "<body");
	$variable = substr($variable, $pos);
	$htmlPos = strpos($variable, '</body>');
	$variable = substr($variable, 0, $htmlPos);
	//$variable = parse($variable);
	ob_end_clean();

	echo 'callback({"data": ' . json_encode(mb_convert_encoding($variable, "UTF-8", "Windows-1252")) . '})';
	//phpinfo();
}

?>