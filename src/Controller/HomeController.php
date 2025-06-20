<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/contact/send', name: 'contact_send', methods: ['POST'])]
    public function sendContact(Request $request, MailerInterface $mailer): Response
    {
        $nombre = $request->request->get('nombre');
        $correo = $request->request->get('correo');
        $mensaje = $request->request->get('mensaje');

        if (!$nombre || !$correo || !$mensaje) {
            $this->addFlash('error', 'Por favor complete todos los campos.');
            return $this->redirectToRoute('app_home');
        }

        $email = (new Email())
            ->from($correo)
            ->to('tuemail@midominio.com')  // Cambia por tu email real
            ->subject('Mensaje desde web de ' . $nombre)
            ->text("Nombre: $nombre\nCorreo: $correo\n\nMensaje:\n$mensaje");

        try {
            $mailer->send($email);
            $this->addFlash('success', 'Mensaje enviado correctamente.');
        } catch (\Exception $e) {
            $this->addFlash('error', 'Error al enviar el mensaje. Intenta nuevamente.');
        }

        return $this->redirectToRoute('app_home');
    }
}