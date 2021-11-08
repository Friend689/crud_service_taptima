<?php

namespace App\Controller;

use App\Entity\Author;
use App\Entity\Book;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Asset\PathPackage;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class BookController extends AbstractController
{
  /**
   * @Route("/book", name="book")
   */
  public function index(): Response
  {
    return $this->render('book/index.html.twig', [
        'controller_name' => 'BookController',
    ]);
  }

  public function getAllBooks()
  {
    $book = $this->bookRepository->findAll();
    return $book;
  }

  public function getOneBook($id)
  {
    $book = $this->bookRepository->find($id);
    return $book;
  }

  public function createBook(Request $request)
  {
    $bookRepository = $this->getDoctrine()->getRepository(Book::class);
    $authorRepository = $this->getDoctrine()->getRepository(Author::class);
    $entityManager = $this->getDoctrine()->getManager();
    $Request = $request->request->all();
//    dd($Request['author']);
//    dd($authorRepository->find());
    $book = new Book();
    if (isset($Request['cover']))
      $book->setCover($Request['cover']);
    if (isset($Request['title']))
      $book->setTitle($Request['title']);
    if (isset($Request['author']))
      if (is_array($Request['author'])) {
        foreach ($Request['author'] as $authorIndex) {
          $author = $authorRepository->find($authorIndex);
          $author->addBook($book);
        }
      } else {
        $author = $authorRepository->find($Request['author']);
        $author->addBook($book);
      }
    if (isset($Request['year']))
      $book->setYear($Request['year']);
    if (isset($Request['description']))
      $book->setDescription($Request['description']);
    $entityManager->persist($book);
    $entityManager->flush();

    return $this->redirectToRoute('index');
  }

  public function updateBook($id, Request $request)
  {
    $bookRepository = $this->getDoctrine()->getRepository(Book::class);
    $authorRepository = $this->getDoctrine()->getRepository(Author::class);
    $entityManager = $this->getDoctrine()->getManager();
    $Request = $request->request->all();
    $coverFile = $request->files->get('cover');
//    dd($coverFile);
    $book = $bookRepository->find($id);
    dd($this->get('templating.helper.assets'));
    if ($coverFile !== null) {
      $fileName = uniqid() . '-' . $coverFile->getClientOriginalName();
      $book->setCover($fileName);
      $path = $this->get('kernel.dir').'/public/covers/' . $book->getId() . '/';
      $coverFile->move($path, $fileName);
    }
    if (isset($Request['title']))
      $book->setTitle($Request['title']);
    if (isset($Request['author']) && $Request['author'] > 0)
      if (is_array($Request['author'])) {
        $book->setAuthor($Request['author']);
      }
    if (isset($Request['year']))
      $book->setYear($Request['year']);
    if (isset($Request['description']))
      $book->setDescription($Request['description']);
    $entityManager->flush();
    return $this->redirectToRoute('index');
  }

  public function deleteBook($id)
  {
    $bookRepository = $this->getDoctrine()->getRepository(Book::class);
    $entityManager = $this->getDoctrine()->getManager();
    $book = $bookRepository->find($id);
    $entityManager->remove($book);
    $entityManager->flush();
    return $this->redirectToRoute('/');
  }
}
