<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

//От кого
$mail->setFrom('testkek@mail.ru', 'От Ивана Иванова');
//Кому
$mail->addAddress('shurikation@gmail.com'); //Один или несклько адресов
//Тема письма
$mail->Subject = 'Привет! Это Иван Иванов';

//Рука
$hand = "Правая";
if($_POST['hand'] == "left") {
   $hand = "Левая";
}

//Тело пиьма
$body = '<h1>Это тело письма</h1>';

if(trim(!empty($_POST['name']))) {
   $body.='<p>Name:</p> '.$_POST['name'].'</p>';
}

if(trim(!empty($_POST['email']))) {
   $body.='<p>Email:</p> '.$_POST['email'].'</p>';
}

if(trim(!empty($_POST['hand']))) {
   $body.='<p>Hand:</p> '.$hand.'</p>';
}

if(trim(!empty($_POST['age']))) {
   $body.='<p>Age:</p> '.$_POST['age'].'</p>';
}

//Прикрепить файл
if(!empty($_FILES['image']['tmp_name'])) {
   //путь загрузки файла
   $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
   //грузим файл
   if(copy($_FILES['image']['tmp_name'], $filePath)) {
      $fileAttach = $filePath;
      $body.='<p>Foto in attach</p>';
      $mail->addAttachment($fileAttach);
   }
}

$mail->Body = $body;

//Отправляем
if(!$mail->send()) {
   $message = 'Error';
} else {
   $message = 'Succesefuly sent!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>