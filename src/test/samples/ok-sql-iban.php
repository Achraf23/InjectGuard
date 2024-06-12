<?php
    $iban = $_POST["iban"];
    $date = $_POST["date"];

    if(strlen($iban)==14 and preg_match('/\^[0-9-]\*\$/',$date)){
        $result = sqlite_query(
            "SELECT * FROM USERS WHERE"
            ."IBAN= '$iban' and dat='$date'");
    }   

?>