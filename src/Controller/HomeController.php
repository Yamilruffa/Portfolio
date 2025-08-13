<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpKernel\KernelInterface;

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;


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
        public function sendContact(
            Request $request,
            MailerInterface $mailer,
            CsrfTokenManagerInterface $csrfTokenManager
        ): Response {
            $token = $request->request->get('_token');

            if (!$csrfTokenManager->isTokenValid(new CsrfToken('contact_form', $token))) {
                $this->addFlash('error', 'Token CSRF inválido.');
                return $this->redirectToRoute('app_home');
            }

            $nombre = $request->request->get('nombre');
            $correo = $request->request->get('correo');
            $mensaje = $request->request->get('mensaje');
            $honeypot = $request->request->get('telefono');

            if (!empty($honeypot)) {
                return new Response('Formulario inválido.', 400);
            }

            if (!$nombre || !$correo || !$mensaje) {
                $this->addFlash('error', 'Por favor complete todos los campos.');
                return $this->redirectToRoute('app_home');
            }

            $email = (new Email())
                ->from($correo)
                ->to('devruffa@gmail.com') // Reemplazado por tu correo real
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