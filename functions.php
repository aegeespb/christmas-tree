<?php

date_default_timezone_set('Europe/Moscow');
$current_date = strtotime(date('d.m.Y'));
$database = "wishes.sqlite";
$log = "assets/log.txt";

if (!file_exists($database)) {
    $database = new SQLite3($database);
    $sql = "CREATE TABLE wishes(id INTEGER PRIMARY KEY, datetime INTEGER, fname TEXT, lname TEXT, host TEXT, message TEXT, position INTEGER, ip TEXT)";
    $database->query($sql);
} else {
    $database = new SQLite3($database);
    $sql = "SELECT * FROM wishes";
    $total = $database->query($sql);
}

$client_ip = $_SERVER["REMOTE_ADDR"];

if (isset($_POST["submit"])) {
    $search_statement = $database->prepare("SELECT ip FROM wishes WHERE ip = :ip");
    $search_statement->bindValue(":ip", $client_ip);
    $search_result = $search_statement->execute();

    if (!$search_result->fetchArray()) {

        $name = htmlspecialchars($_POST["modal-wish-name"]);
        $last_name = htmlspecialchars($_POST["modal-wish-last-name"]);
        $host = htmlspecialchars($_POST["modal-wish-host"]);
        $message = htmlspecialchars(trim($_POST["modal-wish-message"]));
        $position = htmlspecialchars($_POST["modal-wish-position"]);

        // gen array
        $new_wish = array();
        $new_wish["date"] = $current_date;
        $new_wish["name"] = $name;
        $new_wish["last_name"] = $last_name;
        $new_wish["host"] = $host;
        $new_wish["message"] = $message;
        $new_wish["position"] = $position;
        $new_wish["ip"] = $client_ip;

        // prepare sql
        $insert = "INSERT INTO wishes (datetime, fname, lname, host, message, position, ip) VALUES (:datetime, :fname, :lname, :host, :message, :position, :ip)";
        $insert_statement = $database->prepare($insert);

        // execute
        $insert_statement->bindParam(":datetime", $new_wish["date"]);
        $insert_statement->bindParam(":fname", $new_wish["name"]);
        $insert_statement->bindParam(":lname", $new_wish["last_name"]);
        $insert_statement->bindParam(":host", $new_wish["host"]);
        $insert_statement->bindParam(":message", $new_wish["message"]);
        $insert_statement->bindParam(":position", $new_wish["position"]);
        $insert_statement->bindParam(":ip", $new_wish["ip"]);
        $insert_statement->execute();

        // logging
        file_put_contents($log, implode(",", $new_wish) . "\n", FILE_APPEND | LOCK_EX);

    } else {
        $_SESSION["error_status"] = 1;
    }

}
