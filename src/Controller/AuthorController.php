<?php

namespace App\Controller;

use App\Entity\Author;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AuthorController extends AbstractController
{
    /**
     * @Route("/author", name="author")
     */
    public function index(): Response
    {
        return $this->render('author/index.html.twig', [
            'authors' => $this->getAllAuthors(),
        ]);
    }

  public function getAllAuthors() {
    $repository = $this->getDoctrine()->getRepository(Author::class);
    $authors = $repository->findAll();
    return $authors;
  }

  public function getOneAuthor($id) {
    $repository = $this->getDoctrine()->getRepository(Author::class);
    $author = $repository->find($id);
    return $author;
  }

  public function createAuthor(Request $request)
  {
    $Request = $request->request->all();
    $em = $this->getDoctrine()->getManager();
    $author = new Author();
    $author->setName($Request['fio']);
    $em->persist($author);
    $em->flush();

    return $this->redirectToRoute('index');
  }

  public function updateAuthor($id, Request $request)
  {
    $Request = $request->request->all();
    $em = $this->getDoctrine()->getManager();
    $repository = $this->getDoctrine()->getRepository(Author::class);
    $author = $repository->find($id);
    $author->setName($Request['fio']);
    $em->flush();
    return $this->redirectToRoute('index');
  }

  public function deleteAuthor($model, $id)
  {
    $repository = $this->getDoctrine()->getRepository(Author::class);
    $em = $this->getDoctrine()->getManager();
    $author = $repository->find($id);
    $em->remove($author);
    $em->flush();
    return $this->redirectToRoute('index');
  }

  public function getCoAuthors($authorId)
  {
//    dd("there");
    $entityManager = $this->getEntityManager();

    $query = $entityManager->createQuery(
        'SELECT b, c
            FROM App\Entity\Book p
            INNER JOIN b.category c
            WHERE p.id = :id'
    )->setParameter('id', $authorId);

    return $query->getOneOrNullResult();
  }

//  public function getByCategory($category)
//  {
//    $qb = $this->createQueryBuilder('p');
//    $qb->leftJoin('p.categories', 'c');
//    $qb->where('c.url = :category');
//    $qb->setParameter('category', $category);
//
//    return $qb->getQuery()->useQueryCache(true);
//  }
}
