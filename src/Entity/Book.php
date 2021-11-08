<?php

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=BookRepository::class)
 */
class Book
{
  /**
   * @ORM\Id
   * @ORM\GeneratedValue
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $title;

  /**
   * @ORM\ManyToOne(targetEntity=Author::class, inversedBy="books")
   */
  private $author;

  /**
   * @ORM\Column(type="text", nullable=true)
   */
  private $description;

  /**
   * @ORM\Column(type="text", nullable=true)
   */
  private $cover;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $year;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getTitle(): ?string
  {
    return $this->title;
  }

  public function setTitle(string $title): self
  {
    $this->title = $title;

    return $this;
  }

  public function getAuthor(): ?Author
  {
    return $this->author;
  }

  public function setAuthor(?Author $author): self
  {
    $this->author = $author;

    return $this;
  }

  public function getDescription(): ?string
  {
    return $this->description;
  }

  public function setDescription(?string $description): self
  {
    $this->description = $description;

    return $this;
  }

  public function getCover(): ?string
  {
    return $this->cover;
  }

  public function setCover(?string $cover): self
  {
    $this->cover = $cover;

    return $this;
  }

  public function getYear(): ?string
  {
    return $this->year;
  }

  public function setYear(?string $year): self
  {
    $this->year = $year;

    return $this;
  }
}
