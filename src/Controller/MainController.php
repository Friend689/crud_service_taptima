<?php


namespace App\Controller;

use App\Entity\Author;
use App\Entity\Book;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\Query;

class MainController extends AbstractController
{
  public function indexPage()
  {
    $bookRepository = $this->getDoctrine()->getRepository(Book::class);
//    $query = $this->getDoctrine()
//        ->getRepository(Book::class)
//        ->createQueryBuilder('c')
//        ->innerJoin('c.author', 'r')
//        ->getQuery();
//    $books = $query->getResult(Query::HYDRATE_ARRAY);
//    dd($bookRepository->findAll());

    $authorRepository = $this->getDoctrine()->getRepository(Author::class);
    $authorsArr = $authorRepository->findAll();
    $authors = [];
    foreach ($authorsArr as $author) {
      $authors['title'][] = $author->getName();
      $authors['value'][] = $author->getId();
    }
    return $this->render('main/index.html.twig', [
        "books"       => $bookRepository->findAll(),
        "authors"     => $authors,
        "authorsArr"  => $authorsArr,
    ]);
  }

  public function getAllByModel($model, Request $request)
  {
    dd($model, $request->request->all());
  }

  public function getOneByModel($model, $id)
  {
    dd($model);
  }

  public function createAuthor(Request $request)
  {
    $Request = $request->request->all();
    $entityManager = $this->getDoctrine()->getManager();
    $author = new Author();
    $author->setName($Request['fio']);
    $entityManager->persist($author);
    $entityManager->flush();

    return $this->redirectToRoute('index');
  }

  public function updateByModel($model, $id, Request $request)
  {
    dd($model, $request->request->all());
  }

  public function deleteByModel($model, $id)
  {
    dd($model, $id);
  }
}
