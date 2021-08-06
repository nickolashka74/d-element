<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('test@test.ru', 'Клиент');
	//Кому отправить
	$mail->addAddress('ni@progroup.su');
	//Тема письма
	$mail->Subject = 'Новая заявка';

	//Тело письма
	$body = '<h1>Информация о клиенте:</h1>';
	
	if(trim(!empty($_POST['username']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['username'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
	}

	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Упс, что-то пошло не так на сервере!';
	} else {
		$message = 'Ваше письмо успешно отправлено!';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>