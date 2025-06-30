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

    #[Route('/images/list', name: 'images_list', methods: ['GET'])]
    public function listImages(Request $request, KernelInterface $kernel): JsonResponse
    {
        $folder = $request->query->get('folder');  // ej: 'cookbook'

        if (!$folder) {
            return $this->json(['error' => 'Falta el parámetro folder'], 400);
        }

        // Solo permitir ciertas carpetas para evitar vulnerabilidades
        $allowedFolders = ['cookbook', 'otra-carpeta']; // agrega aquí carpetas permitidas
        if (!in_array($folder, $allowedFolders)) {
            return $this->json(['error' => 'Carpeta no permitida'], 403);
        }

        // Ruta absoluta a la carpeta pública de imágenes
        $publicDir = $kernel->getProjectDir() . '/public/images/' . $folder;

        if (!is_dir($publicDir)) {
            return $this->json(['error' => 'Carpeta no encontrada'], 404);
        }

        $images = [];
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        // Leer archivos en el directorio
        $files = scandir($publicDir);

        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, $allowedExtensions)) {
                // Generar URL accesible públicamente
                $images[] = '/images/' . $folder . '/' . $file;
            }
        }

        return $this->json(['images' => $images]);
    }
}